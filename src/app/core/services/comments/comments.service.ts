import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { DocumentReference, addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, updateDoc, writeBatch } from "firebase/firestore";
import { IComment } from "../../interfaces/new.interface";
import { convertTimestamp2Date } from '../../utils';
import { firebaseConfig } from "../firebase.config";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private db;

  constructor() {
    const app = initializeApp(firebaseConfig);  // Initialize Firebase
    this.db = getFirestore(app);                // Initialize Cloud Firestore and get a reference to the service
  }

  /*
   * Create Comment
   */
  public async create(newsId: string, comment: IComment): Promise<boolean> {
    try {
      const newsDocRef = doc(this.db, "news", newsId);
      const commentsColRef = collection(newsDocRef, "comments");

      const docRef = await addDoc(commentsColRef, {
        author: comment.author,
        text: comment.text,
        date: comment.date,
      });

      console.log("Commnet written with ID: ", docRef.id);
      return true;
    } catch (error) {
      console.error("Error adding commnet: ", error);
      return false;
    }
  }

  /*
   * Update Comment
   */
  public async update(newsId: string, commentId: string, updatedData: Partial<IComment>): Promise<boolean> {
    try {
      const newsDocRef = doc(this.db, "news", newsId);
      const commentDocRef = doc(collection(newsDocRef, "comments"), commentId);
      await updateDoc(commentDocRef, updatedData);

      console.log("Commnet updated with ID: ", commentId);
      return true;
    } catch (error) {
      console.error("Error updating commnet: ", error);
      return false;
    }
  }

  /*
   * Delete Comment
   */
  public async delete(newsId: string, commentId: string): Promise<boolean> {
    try {
      const newsDocRef = doc(this.db, "news", newsId);
      const commentsColRef = doc(collection(newsDocRef, "comments"), commentId);
      await deleteDoc(commentsColRef);

      console.log("Commnet deleted with ID: ", commentId);
      return true;
    } catch (error) {
      console.error("Error deleting commnet: ", error);
      return false;
    }
  }

  /*
   * Get all Comments from a News
   */
  public async getCommentsFromDoc(newsDocRef: DocumentReference): Promise<IComment[]> {
    const commentsColRef = collection(newsDocRef, "comments");
    const q = query(commentsColRef, orderBy("date", "desc"));
    const commentsSnap = await getDocs(q);

    const comments: IComment[] = commentsSnap.docs.map(doc => {
      const commentData = doc.data();

      convertTimestamp2Date(commentData);

      commentData['isEditing'] = false;

      return { id: doc.id, ...commentData } as IComment;
    });

    return comments;
  }
  
  /*
   * Delete all Comments from a News
   */
  public async deleteCommentsFromDoc(newsDocRef: DocumentReference): Promise<boolean> {
    try {
      const commentsColRef = collection(newsDocRef, "comments");
      const commentsSnap = await getDocs(commentsColRef);

      const batch = writeBatch(this.db);

      commentsSnap.forEach((commentDoc) => {
        batch.delete(commentDoc.ref);
      });

      await batch.commit();
      console.log("Commnets deleted for document with ID: ", newsDocRef.id);
      return true;
    } catch (error) {
      console.error("Error deleting commnets: ", error);
      return false;
    }
  }
}
