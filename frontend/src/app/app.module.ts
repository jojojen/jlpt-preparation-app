import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { FeedbackService } from './feedback.service';
import { HttpClientModule } from '@angular/common/http';
import { FeedbackComponent } from './feedback/feedback.component';
import { FooterComponent } from './footer/footer.component';

import { AuthService } from './auth.service';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { SignInComponent } from './signin/signin.component';
import { initializeApp } from "firebase/app";

@NgModule({
  declarations: [
    AppComponent,
    FeedbackComponent,
    FooterComponent,
    SignInComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
  ],
  providers: [FeedbackService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
