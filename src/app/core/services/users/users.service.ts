import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { catchError, from, Observable, of, Subject, switchMap, throwError } from 'rxjs';
import { firebaseConfig } from '../firebase.config';
import { IUser } from './../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private db;
  private reloadSubject = new Subject<void>();
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
   * Update user data
   */
  public update(id: string, updatedData: Partial<IUser>, isUsernameChanged: boolean): Observable<any> {
    const error = new Error();
    if (updatedData.userName) {
      return from(this.isUserNameInUseByAnotherUser(updatedData.userName, isUsernameChanged)).pipe(
        switchMap(isInUse => {
          if (isInUse) {
            error.name = 'UsernameInUseError';
            return throwError(() => error);
          } else {
            const userDocRef = doc(this.db, UsersService.COLLECTION_NAME, id);

            return from(updateDoc(userDocRef, updatedData)).pipe(
              switchMap(() => of(updatedData)),
              catchError(err => {
                return throwError(() => err);
              })
            );
          }
        })
      );
    }

    return throwError(() => error);
  }

  /*
   * Check if the username is already in use
   */
  public async isUserNameInUse(userNameToFind: string): Promise<boolean> {
    const users = await this.getAll();
    return users.some(user => user.userName === userNameToFind);
  }

  /*
   * Check if the username is already in use by another user
   */
  public async isUserNameInUseByAnotherUser(userNameToFind: string, isUsernameChanged: boolean): Promise<boolean> {
    return isUsernameChanged ? await this.isUserNameInUse(userNameToFind) : false;
  }

  loadUser(): void {
    this.reloadSubject.next();
  }

  get reload$() {
    return this.reloadSubject.asObservable();
  }
}
