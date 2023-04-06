// feedback.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent {
  @Input() feedbackSubmitted: boolean = false;
  @Input() isLoading: boolean = false;
  @Output() submitFeedback: EventEmitter<{ feedback: 'good' | 'bad'; comment: string }> = new EventEmitter();
  feedback: 'good' | 'bad' = 'good';
  comment: string = '';
  disableSubmitButton: boolean = false;

  constructor() {}

  onSubmit() {
    this.disableSubmitButton = true;
    this.submitFeedback.emit({ feedback: this.feedback, comment: this.comment });
  }
}
