import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { ReloadableService } from '../../base/reloadable.service';
import { firestore } from '../../firebase/firebase.provider';
import { ITopic } from '../../interfaces/topic.interface';
import { convertTimestamp2Date } from '../../utils';
import { CommentsService } from '../comments/comments.service';
import { RelationResolverService } from '../relation-resolver.service';

@Injectable({
  providedIn: 'root'
})
export class TopicsService extends ReloadableService{
  private static readonly COLLECTION_NAME = "topics";

  constructor(
    private readonly commentsService: CommentsService,
    private readonly relationResolverService: RelationResolverService
  ) {
    super();
   }

  /*
   * Create Topic
   */
  public async create(n: ITopic): Promise<boolean> {
    try {
      const docRef = await addDoc(collection(firestore, TopicsService.COLLECTION_NAME), {
        title: n.title,
        date: new Date(),
        commentsCount: 0,
        author: doc(firestore, `users/${n.author!.id}`),
      });

      this.triggerReload();

      console.log("Topic written with ID: ", docRef.id);
      return true;
    } catch (error) {
      console.error("Error adding topic: ", error);
      return false;
    }
  }

  /*
   * Update Topic
   */
  public async update(id: string, updatedData: Partial<ITopic>): Promise<boolean> {
    try {
      const topicsDocRef = doc(firestore, TopicsService.COLLECTION_NAME, id);

      await updateDoc(topicsDocRef, updatedData);

      this.triggerReload();

      console.log("Topic updated with ID: ", id);
      return true;
    } catch (error) {
      console.error("Error updating topic: ", error);
      return false;
    }
  }

  /*
   * Delete Topic
   */
  public async delete(id: string): Promise<boolean> {
    try {
      const topicsDocRef = doc(firestore, TopicsService.COLLECTION_NAME, id);

      // Delete comments subcollection
      await this.commentsService.deleteCommentsFromDoc(topicsDocRef);

      await deleteDoc(topicsDocRef);
      
      this.triggerReload();

      console.log("Topic deleted with ID: ", id);
      return true;
    } catch (error) {
      console.error("Error deleting topic: ", error);
      return false;
    }
  }

  /*
   * Get all Topics
   */
  public async getAll(): Promise<ITopic[]> {
    try {
      const q = query(collection(firestore, TopicsService.COLLECTION_NAME), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);

      // Wait for all async operations
      const topics = await Promise.all(querySnapshot.docs.map(async (document) => {
        const data = document.data();

        convertTimestamp2Date(data);

        // Get author
        data["author"] = await this.relationResolverService.resolve(data['author']);

        return { id: document.id, ...data } as ITopic;
      }));

      console.log(topics);
      return topics;
    } catch (error) {
      console.error("Error getting topics: ", error);
      return [];
    }
  }

  /*
   * Get Topic by Id 
   */
  public async getById(id: string): Promise<ITopic | null> {
    try {
      const topicsDocRef = doc(firestore, TopicsService.COLLECTION_NAME, id);
      const docSnap = await getDoc(topicsDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        convertTimestamp2Date(data);

        // Get author
        data["author"] = await this.relationResolverService.resolve(data['author']);

        // Get comments
        data['comments'] = await this.commentsService.getCommentsFromDoc(topicsDocRef);

        return { id: docSnap.id, ...data } as ITopic;
      } else {
        console.error("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting topic:", error);
      return null;
    }
  }
}