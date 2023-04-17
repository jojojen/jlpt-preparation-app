// signin.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SignInComponent implements OnInit {
  isLoggedIn = false;
  private authStateSubscription!: Subscription;

  constructor(public authService: AuthService, private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.authStateSubscription = this.afAuth.authState.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy() {
    // Unsubscribe from authState when the component is destroyed
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
  }
}

