// auth.service.ts
import { Injectable } from '@angular/core';
import { AuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private http: HttpClient
  ) {
    this.user$ = afAuth.authState;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider: AuthProvider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        console.log('You have been successfully logged in!');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      console.log('You have been successfully logged out!');
    });
  }

  // Add this method to get user data from the API
  getUserData(uid: string): Observable<any> {
    return this.http.get(`https://jlpt-app-backend-jojojen.vercel.app/user/${uid}`);
  }

  // auth.service.ts
  updateUserData(uid: string, data: any): Observable<any> {
    return this.http.put(`https://jlpt-app-backend-jojojen.vercel.app/user/${uid}`, data);
  }

}
