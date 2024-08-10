import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { DocumentReference, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";
import { Subject } from 'rxjs';
import { INew } from "../../interfaces/new.interface";
import { convertTimestamp2Date, urlToFile } from '../../utils';
import { CommentsService } from '../comments/comments.service';
import { CommonService } from '../common/common.service';
import { firebaseConfig } from "../firebase.config";

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private db;
  private storage;
  private reloadSubject = new Subject<void>();
  private static readonly COLLECTION_NAME = "news";

  constructor(
    private commentsService: CommentsService,
    private commonService: CommonService,
  ) {
    const app = initializeApp(firebaseConfig);  // Initialize Firebase
    this.db = getFirestore(app);                // Initialize Cloud Firestore and get a reference to the service
    this.storage = getStorage(app);
  }

  /*
   * Create New
   */
  public async create(n: INew): Promise<boolean> {
    try {
      const docRef = await addDoc(collection(this.db, NewsService.COLLECTION_NAME), {
        title: n.title,
        summary: n.summary,
        text: n.text,
        image: "",
        date: new Date(),
        author: doc(this.db, `users/${n.author!.id}`),
      });

      if (n.image) {
        const imageUploadSuccess = await this.commonService.uploadImage(docRef.id, n.image, NewsService.COLLECTION_NAME, "imageUrl");
        if (!imageUploadSuccess) {
          console.error('Error uploading image');
          return false;
        }
      }

      console.log("New written with ID: ", docRef.id);
      return true;
    } catch (error) {
      console.error("Error adding new: ", error);
      return false;
    }
  }

  /*
   * Update New
   */
  public async update(id: string, updatedData: Partial<INew>, newImageFile: File | null): Promise<boolean> {
    try {
      const newsDocRef = doc(this.db, NewsService.COLLECTION_NAME, id);

      if (newImageFile) {
        const folderRef = ref(this.storage, `${NewsService.COLLECTION_NAME}_images/${id}`);

        // List and delete all files in the folder
        const files = await listAll(folderRef);
        const deletePromises = files.items.map(fileRef => deleteObject(fileRef));
        await Promise.all(deletePromises);

        // Upload the new image
        const imageRef = ref(this.storage, `${NewsService.COLLECTION_NAME}_images/${id}/${newImageFile.name}`);
        const snapshot = await uploadBytes(imageRef, newImageFile);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update the Firestore document with the new image URL
        updatedData.imageUrl = downloadURL;
      }

      await updateDoc(newsDocRef, updatedData);
      console.log("New updated with ID: ", id);
      return true;
    } catch (error) {
      console.error("Error updating new: ", error);
      return false;
    }
  }

  /*
   * Delete New
   */
  public async delete(id: string): Promise<boolean> {
    try {
      const newsDocRef = doc(this.db, NewsService.COLLECTION_NAME, id);

      await this.deleteImageFromNew(newsDocRef);

      // Delete comments subcollection
      await this.commentsService.deleteCommentsFromDoc(newsDocRef);

      await deleteDoc(newsDocRef);
      console.log("New deleted with ID: ", id);

      return true;
    } catch (error) {
      console.error("Error deleting new: ", error);
      return false;
    }
  }

  /*
   * Get all News
   */
  public async getAll(): Promise<INew[]> {
    try {
      const querySnapshot = await getDocs(collection(this.db, NewsService.COLLECTION_NAME));
      const news: INew[] = [];

      // Wait for all async operations
      await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data();

        convertTimestamp2Date(data);

        // Get news image
        data['image'] = await urlToFile(data['imageUrl']);

        news.push({ id: doc.id, ...data } as INew);
      }));

      news.sort((a, b) => b.date.getTime() - a.date.getTime());

      return news;
    } catch (error) {
      console.error("Error getting news: ", error);
      return [];
    }
  }

  /*
   * Get New by Id 
   */
  public async getById(id: string): Promise<INew | null> {
    try {
      const newsDocRef = doc(this.db, NewsService.COLLECTION_NAME, id);
      const docSnap = await getDoc(newsDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        convertTimestamp2Date(data);

        this.commonService.getAuthor(data);

        // Get comments
        data['comments'] = await this.commentsService.getCommentsFromDoc(newsDocRef);

        // Get news image
        data['image'] = await urlToFile(data['imageUrl']);

        return { id: docSnap.id, ...data } as INew;
      } else {
        console.error("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting new:", error);
      return null;
    }
  }


  // Delete the image from Firebase Storage
  private async deleteImageFromNew(newsDocRef: DocumentReference) {
    const docSnap = await getDoc(newsDocRef);

    let imageUrl = null;
    if (docSnap.exists()) {
      imageUrl = docSnap.data()['imageUrl'];
    }

    if (imageUrl) {
      const imageRef = ref(this.storage, imageUrl);
      await deleteObject(imageRef);
      console.log('Image deleted: ', imageUrl);
    }
  }

  loadNews(): void {
    this.reloadSubject.next();
  }

  get reload$() {
    return this.reloadSubject.asObservable();
  }
}