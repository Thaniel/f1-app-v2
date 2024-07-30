import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import { IUser } from '../../interfaces/user.interface';
import { firebaseConfig } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private db;
  private static readonly COLLECTION_NAME = "users";

  constructor(
  ) {
    const app = initializeApp(firebaseConfig);  // Initialize Firebase
    this.db = getFirestore(app);                // Initialize Cloud Firestore and get a reference to the service
  }

  /*
   * Get all Users
   */
  public async getAll(): Promise<IUser[]> {
    try {
      const querySnapshot = await getDocs(collection(this.db, UsersService.COLLECTION_NAME));
      const users: IUser[] = [];

      // Wait for all async operations
      await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        
        users.push({ id: doc.id, ...data } as IUser);         
      }));

      return users;
    } catch (error) {
      console.error("Error getting users: ", error);
      return [];
    }
  }

  /*
   * Get User by Id
   */
  public async getById(id: string): Promise<IUser | null> {
    try {
      const userDocRef = doc(this.db, UsersService.COLLECTION_NAME, id);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        return { id: docSnap.id, ...data } as IUser;
      } else {
        console.error("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  }

  /*
   * Check if the username is already in use by another user
   */
  public async isUserNameInUse(userNameToFind: string): Promise<boolean> {
    const users = await this.getAll();
    return users.some(user => user.userName === userNameToFind);
  }

}
