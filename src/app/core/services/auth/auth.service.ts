import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updatePassword, User, UserCredential } from "firebase/auth";
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { BehaviorSubject, catchError, from, Observable, of, switchMap, throwError } from 'rxjs';
import { IRegister } from '../../interfaces/register.interface';
import { IUser } from '../../interfaces/user.interface';
import { firebaseConfig } from '../firebase.config';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth;
  private firestore;

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private currentUserInfo: IUser | null;

  constructor(
    private usersService: UsersService,
  ) {
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.firestore = getFirestore(app);

    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentUserInfo = null;
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  /*
   * Register new user
   */
  public register(newUser: IRegister): Observable<any> {
    const error = new Error();
    return from(this.usersService.isUserNameInUse(newUser.userName)).pipe(
      switchMap(isInUse => {
        if (isInUse) {
          error.name = 'UsernameInUseError';
          return throwError(() => error);
        } else {
          return from(createUserWithEmailAndPassword(this.auth, newUser.email, newUser.password)).pipe(
            switchMap((userCredential: UserCredential) => {
              return from(this.createUserDocument(userCredential, newUser)).pipe(
                switchMap(() => of(userCredential))
              );
            }),
            catchError(err => {
              if (err.code === 'auth/email-already-in-use') {
                error.name = 'EmailInUseError';
                return throwError(() => error);
              }
              return throwError(() => err);
            })
          );
        }
      })
    );
  }

  /*
   * Create user document in Firestore
   */
  private createUserDocument(userCredential: UserCredential, newUser: IRegister): Promise<void> {
    const userRef = doc(this.firestore, `users/${userCredential.user.uid}`);
    return setDoc(userRef, {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      country: newUser.country,
      birthdate: newUser.birthdate,
      userName: newUser.userName,
      isAdmin: false,
    });
  }

  /*
   * Login into firebase
   */
  public login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password).then(userCredential => {
      this.getUserInfo(userCredential.user.uid);
      localStorage.setItem("uid", userCredential.user.uid);
    }));
  }

  /*
   * Change the password of the authenticated user
   */
  public changePassword(oldPassword: string, newPassword: string): Observable<void> {
    const error = new Error();
    const user = this.auth.currentUser;

    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }

    const credential = EmailAuthProvider.credential(user.email!, oldPassword);

    return from(reauthenticateWithCredential(user, credential)).pipe(
      switchMap(() => {
        return from(updatePassword(user, newPassword));
      }),
      catchError(err => {
        if (err.code === 'auth/invalid-credential') {
          error.name = 'InvalidCredential';
          return throwError(() => error);
        }

        return throwError(() => err);
      })
    );
  }

  private async getUserInfo(uid: string) {
    this.currentUserInfo = await this.usersService.getById(uid);
  }

  /*
   * Logout from firebase
   */
  public logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  /*
   * Send an Email to change the password
   */
  public recoverPassword(email: string): Observable<any> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  /*
   * Get current authenticated user
   */
  public getCurrentUser(): Observable<User | null> {
    return this.currentUser;
  }

  /*
   * Get current authenticated user information
   */
  public async getCurrentUserInfo(): Promise<IUser | null> {
    let uid = localStorage.getItem("uid");

    if (this.currentUserInfo == null && uid) {
      await this.getUserInfo(uid);
    }

    return this.currentUserInfo;
  }
}
