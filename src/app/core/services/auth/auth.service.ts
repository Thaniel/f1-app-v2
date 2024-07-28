import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { BehaviorSubject, from, Observable } from 'rxjs';
import { firebaseConfig } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth;

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);

    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  /*
   * Register new user
   */
  public register(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  /*
   * Login into firebase
   */
  public login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
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
}
