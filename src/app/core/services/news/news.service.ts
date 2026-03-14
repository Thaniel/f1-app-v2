import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { ReloadableService } from '../../base/reloadable.service';
import { ImageService } from '../../feature/image.service';
import { firestore } from '../../firebase/firebase.provider';
import { INew } from "../../interfaces/new.interface";
import { convertTimestamp2Date, urlToFile } from '../../utils';
import { CommentsService } from '../comments/comments.service';
import { RelationResolverService } from '../relation-resolver.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService extends ReloadableService {
  private static readonly COLLECTION_NAME = "news";

  constructor(
    private readonly commentsService: CommentsService,
    private readonly imageService: ImageService,
    private readonly relationResolverService: RelationResolverService
  ) { 
    super();
  }

  /*
   * Create New
   */
  public async create(n: INew): Promise<boolean> {
    try {
      const docRef = await addDoc(collection(firestore, NewsService.COLLECTION_NAME), {
        title: n.title,
        summary: n.summary,
        text: n.text,
        date: new Date(),
        commentsCount: 0,
        author: doc(firestore, `users/${n.author!.id}`),
      });
      
      if (n.image){
        const updateNew: Partial<INew> = {};
        updateNew.imageUrl = await this.imageService.uploadImage(NewsService.COLLECTION_NAME, docRef.id, n.image);
        await updateDoc(docRef, updateNew);
      }

      this.triggerReload();

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
      const newsDocRef = doc(firestore, NewsService.COLLECTION_NAME, id);

      if (newImageFile) {
        const downloadURL = await this.imageService.replaceImage(NewsService.COLLECTION_NAME, id, newImageFile);

        // Update the Firestore document with the new image URL
        updatedData.imageUrl = downloadURL;
      }

      await updateDoc(newsDocRef, updatedData);

      this.triggerReload();

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
      const newsDocRef = doc(firestore, NewsService.COLLECTION_NAME, id);

      await this.imageService.deleteFolder(NewsService.COLLECTION_NAME, id);

      // Delete comments subcollection
      await this.commentsService.deleteCommentsFromDoc(newsDocRef);

      await deleteDoc(newsDocRef);

      this.triggerReload();

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
      const q = query(collection(firestore, NewsService.COLLECTION_NAME), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);


      // Wait for all async operations
      const news = await Promise.all(querySnapshot.docs.map(async (document) => {
        const data = document.data();

        convertTimestamp2Date(data);

        // Get news image
        data['image'] = await urlToFile(data['imageUrl']);

        return { id: document.id, ...data } as INew;
      }));

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
      const newsDocRef = doc(firestore, NewsService.COLLECTION_NAME, id);
      const docSnap = await getDoc(newsDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        convertTimestamp2Date(data);

        // Get author
        data['author'] = this.relationResolverService.resolve(data['author']);

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
}