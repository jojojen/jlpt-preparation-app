/* feedback.service.ts */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {

  // private apiUrl = 'http://localhost:5000/feedback';
  // private apiUrl = 'https://jlpt-app-backend.vercel.app';
  private apiUrl = 'https://jlpt-app-backend-jojojen.vercel.app';

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

    return this.http.post(commentUrl, commentData);
  }
}
