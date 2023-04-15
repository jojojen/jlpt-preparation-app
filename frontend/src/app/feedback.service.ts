/* feedback.service.ts */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {

  // private apiUrl = 'https://jlpt-app-backend.vercel.app';
  // private apiUrl = 'https://jlpt-app-backend-jojojen.vercel.app';
  private apiUrl = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  addCommentToQuestion(feedbackData: {
    uid: string;
    feedback: 'good' | 'bad';
    comment: string;
  }): Observable<any> {
    const questionId = feedbackData.uid;
    const commentData = {
      rating: feedbackData.feedback === 'good' ? 1 : 0,
      comment: feedbackData.comment
    };
    const commentUrl = `${this.apiUrl}/question/${questionId}/comment`;
    console.log("commentUrl: " + commentUrl);
    return this.http.post(commentUrl, commentData);
  }
}
