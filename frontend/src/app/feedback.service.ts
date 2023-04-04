import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private apiUrl = 'http://localhost:5000/feedback';

  constructor(private http: HttpClient) {}

  submitFeedback(feedbackData: {
    uid: string;
    questionJSON: string;
    feedback: string;
    comment: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, feedbackData);
  }
}
