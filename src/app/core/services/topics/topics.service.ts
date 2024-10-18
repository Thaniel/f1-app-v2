import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { Subject } from 'rxjs';
import { ITopic } from '../../interfaces/topic.interface';
import { convertTimestamp2Date } from '../../utils';
import { CommentsService } from '../comments/comments.service';
import { CommonService } from '../common/common.service';
import { firebaseConfig } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {
  private readonly db;
  private readonly reloadSubject = new Subject<void>();
  private static readonly COLLECTION_NAME = "topics";

  constructor(
    private readonly commentsService: CommentsService,
    private readonly commonService: CommonService,
  ) {
    const app = initializeApp(firebaseConfig);  // Initialize Firebase
    this.db = getFirestore(app);                // Initialize Cloud Firestore and get a reference to the service
  }

  /*
   * Create Topic
   */
  public async create(n: ITopic): Promise<boolean> {
    try {
      const docRef = await addDoc(collection(this.db, TopicsService.COLLECTION_NAME), {
        title: n.title,
        date: new Date(),
        author: doc(this.db, `users/${n.author!.id}`),
      });

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
      const topicsDocRef = doc(this.db, TopicsService.COLLECTION_NAME, id);

      await updateDoc(topicsDocRef, updatedData);
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
      const topicsDocRef = doc(this.db, TopicsService.COLLECTION_NAME, id);

      // Delete comments subcollection
      await this.commentsService.deleteCommentsFromDoc(topicsDocRef);

      await deleteDoc(topicsDocRef);
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
      const querySnapshot = await getDocs(collection(this.db, TopicsService.COLLECTION_NAME));
      const topics: ITopic[] = [];

      // Wait for all async operations
      await Promise.all(querySnapshot.docs.map(async (document) => {
        const data = document.data();

        convertTimestamp2Date(data);
        
        await this.commonService.getAuthor(data);
        
        // Get comments of each topic
        const topicsDocRef = doc(this.db, TopicsService.COLLECTION_NAME, document.id);
        data['comments'] = await this.commentsService.getCommentsFromDoc(topicsDocRef);

        topics.push({ id: document.id, ...data } as ITopic);
      }));

      topics.sort((a, b) => b.date.getTime() - a.date.getTime());

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
      const topicsDocRef = doc(this.db, TopicsService.COLLECTION_NAME, id);
      const docSnap = await getDoc(topicsDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        convertTimestamp2Date(data);

        this.commonService.getAuthor(data);

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

  loadTopics(): void {
    this.reloadSubject.next();
  }

  get reload$() {
    return this.reloadSubject.asObservable();
  }
}