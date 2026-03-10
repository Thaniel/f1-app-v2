import { Injectable } from '@angular/core';
import { DocumentReference, addDoc, collection, deleteDoc, doc, getDocs, increment, orderBy, query, updateDoc, writeBatch } from "firebase/firestore";
import { firestore } from '../../firebase/firebase.provider';
import { IComment } from "../../interfaces/comment.interface";
import { convertTimestamp2Date } from '../../utils';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(
    private readonly commonService: CommonService,
  ) { }

  /*
   * Create Comment
   */
  public async create(collectionName: string, id: string, comment: IComment): Promise<boolean> {
    try {
      const docRef = doc(firestore, collectionName, id);
      const commentsColRef = collection(docRef, "comments");

      const commentDocRef = await addDoc(commentsColRef, {
        author: doc(firestore, `users/${comment.author!.id}`),
        text: comment.text,
        date: comment.date,
      });

      await updateDoc(docRef, {
        commentsCount: increment(1)
      });

      console.log("Commnet written with ID: ", commentDocRef.id);
      return true;
    } catch (error) {
      console.error("Error adding commnet: ", error);
      return false;
    }
  }

  /*
   * Update Comment
   */
  public async update(collectionName: string, id: string, commentId: string, updatedData: Partial<IComment>): Promise<boolean> {
    try {
      const docRef = doc(firestore, collectionName, id);
      const commentDocRef = doc(collection(docRef, "comments"), commentId);
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
  public async delete(collectionName: string, id: string, commentId: string): Promise<boolean> {
    try {
      const docRef = doc(firestore, collectionName, id);
      const commentsColRef = doc(collection(docRef, "comments"), commentId);
      await deleteDoc(commentsColRef);

      await updateDoc(docRef, {
        commentsCount: increment(-1)
      });

      console.log("Commnet deleted with ID: ", commentId);
      return true;
    } catch (error) {
      console.error("Error deleting commnet: ", error);
      return false;
    }
  }

  /*
   * Get all Comments from a news or a topic
   */
  public async getCommentsFromDoc(docRef: DocumentReference): Promise<IComment[]> {
    const commentsColRef = collection(docRef, "comments");
    const q = query(commentsColRef, orderBy("date", "desc"));
    const commentsSnap = await getDocs(q);

    const commentPromises = commentsSnap.docs.map(async (doc) => {
      const commentData = doc.data();

      convertTimestamp2Date(commentData);

      await this.commonService.getAuthor(commentData);

      commentData['isEditing'] = false;

      return { id: doc.id, ...commentData } as IComment;
    });

    return await Promise.all(commentPromises);
  }

  /*
   * Delete all Comments from a news or a topic
   */
  public async deleteCommentsFromDoc(docRef: DocumentReference): Promise<boolean> {
    try {
      const commentsColRef = collection(docRef, "comments");
      const commentsSnap = await getDocs(commentsColRef);

      const batch = writeBatch(firestore);

      commentsSnap.forEach((commentDoc) => {
        batch.delete(commentDoc.ref);
      });

      await batch.commit();
      console.log("Commnets deleted for document with ID: ", docRef.id);
      return true;
    } catch (error) {
      console.error("Error deleting commnets: ", error);
      return false;
    }
  }
}
