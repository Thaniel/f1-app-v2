import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseConfig } from '../firebase-config';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth;

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
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
    onAuthStateChanged
    https://firebase.google.com/docs/auth/web/manage-users?hl=es
  */
}
