// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumPageComponent } from './album-page/album-page.component'; 
import { QuestionPageComponent } from './question-page/question-page.component';

const routes: Routes = [
  // Add your routes here
  { path: 'question', component: QuestionPageComponent },
  { path: 'album', component: AlbumPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
