import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User, UserCredential } from "firebase/auth";
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';
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
    return from(createUserWithEmailAndPassword(this.auth, newUser.email, newUser.password).then(userCredential => {
      return this.createUserDocument(userCredential, newUser).then(() => userCredential);
    }));
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

    if (this.currentUserInfo == null && uid){      
       await this.getUserInfo(uid);
    }
    
    return this.currentUserInfo;
  }
}
