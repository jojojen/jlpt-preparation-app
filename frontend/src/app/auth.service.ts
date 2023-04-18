// auth.service.ts
import { Injectable } from '@angular/core';
import { AuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any>;

  // private apiUrl = 'https://jlpt-app-backend.vercel.app';
  // private apiUrl = 'https://jlpt-app-backend-jojojen.vercel.app';
  private apiUrl = environment.API_BASE_URL;

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
    const commentUrl = `${this.apiUrl}/user/${uid}`;
    console.log("commentUrl: " + commentUrl);
    return this.http.get(commentUrl);
  }

  // auth.service.ts
  updateUserData(uid: string, data: any): Observable<any> {
    const commentUrl = `${this.apiUrl}/user/${uid}`;
    console.log("commentUrl: " + commentUrl);
    return this.http.put(commentUrl, data);
  }

}
