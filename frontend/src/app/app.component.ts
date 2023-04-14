// app.component.ts
import { Component } from '@angular/core';
import { Gpt3Service } from './gpt-3.service';
import { FeedbackService } from './feedback.service';
import { generateUniqueHash } from './utils';
import { FeedbackComponent } from './feedback/feedback.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // Declare component properties
  question: string = '';
  options: { id: string; text: string }[] = [];
  correctAnswer: string = '';
  showAnswer: boolean = false;
  resultImage: string = '';
  selectedAnswer: string = '';
  resultDescription: string = '';
  hideSubmitButton = false;
  isLoading: boolean = false;
  disableOptions: boolean = false;
  disableGenerateQuestionButton = false;
  disableSubmitAnswerButton = true;
  errorMessage: string = '';
  questionAll: string = '';
  explain: string = '';
  feedbackSubmitted: boolean = false;
  disableSubmitFeedbackButton: boolean = false;
  showFeedbackComponent: boolean = false;

  constructor(private gpt3Service: Gpt3Service, private feedbackService: FeedbackService, private http: HttpClient) {}

  async getQuestionFromCollection() {
    const API_BASE_URL = 'https://jlpt-app-backend.vercel.app';

    this.disableSubmitFeedbackButton = false;
    this.feedbackSubmitted = false;
    this.showFeedbackComponent = false;

    this.prepareForNewQuestion();

    try {
      const goodUids = await this.http.get<string[]>(`${API_BASE_URL}/feedback/good-uids`).toPromise();
      console.log('Response from /feedback/good-uids:', goodUids);
      if (!goodUids || goodUids.length === 0) {
        throw new Error('No good_uids received');
      }

      console.log("good_uids: " + goodUids);

      const randomUid = goodUids[Math.floor(Math.random() * goodUids.length)];
      // const randomUid = '8ljg73';
      const questionResponse = await this.http.get<{ questionJSON: string }>(`${API_BASE_URL}/feedback/question/${randomUid}`).toPromise();
      if (!questionResponse) {
        throw new Error('No response received');
      }
      const resultText = questionResponse.questionJSON;
      console.log("questionResponse.questionJSON: " + questionResponse.questionJSON);
      const result = JSON.parse(resultText);
      if (result.error) {
        this.handleError(result.error);
      } else {
        this.handleSuccess(resultText);
      }
    } catch (error) {
      this.handleError((error as Error).message);
    }
  }

  private handleError(errorMessage?: string) {
    this.errorMessage = errorMessage || 'Something went wrong, please try later.';
    this.isLoading = false;
  }

  // Generate a new question
  async generateQuestion() {
    this.disableSubmitFeedbackButton = false;
    this.feedbackSubmitted = false;
    this.showFeedbackComponent = false;

    this.prepareForNewQuestion();

    try {
      const { resultText, error } = await this.gpt3Service.callGpt3Api();
      if (error) {
        this.handleError();
      } else {
        this.handleSuccess(resultText);
      }
    } catch (error) {
      this.handleError();
    }
  }

  // Select an answer
  selectAnswer(answer: { id: string; text: string }) {
    if (!this.disableOptions) {
      this.selectedAnswer = answer.id;
      this.disableSubmitAnswerButton = false;
    }
  }

  // Submit the selected answer
  submitAnswer() {
    this.prepareForAnswerEvaluation();

    setTimeout(() => {
      this.evaluateAnswer();
      this.showFeedbackComponent = true; 
    }, 500);
  }

  // Prepare for a new question
  private prepareForNewQuestion() {
    this.disableOptions = true;
    this.isLoading = true;
    this.disableGenerateQuestionButton = true;
    this.showAnswer = false;
    this.hideSubmitButton = false;
    this.resultImage = '';
    this.selectedAnswer = '';
  }

  // Handle successful API response
  private handleSuccess(resultText: string) {
    const result = JSON.parse(resultText);
    this.questionAll = resultText;
    this.question = result.text;
    this.options = result.options;
    this.explain = result.expalain;
    this.correctAnswer = result.answer;
    this.isLoading = false;
    this.disableOptions = false;
  }

  // Prepare for answer evaluation
  private prepareForAnswerEvaluation() {
    this.showAnswer = true;
    this.hideSubmitButton = true;
    this.isLoading = true;
    this.disableSubmitAnswerButton = false;
    this.disableOptions = true;
  }

  // Evaluate the selected answer
  private evaluateAnswer() {
    this.isLoading = false;
    const answerCorrect = this.selectedAnswer === this.correctAnswer;
    const randomNumber = Math.random() * 100;
    this.setResultImageAndDescription(answerCorrect, randomNumber);
    this.disableGenerateQuestionButton = false;
  }

  // Set result image and description based on answer correctness and a random number
  private setResultImageAndDescription(answerCorrect: boolean, randomNumber: number) {
    const rarity = randomNumber < 79 ? 'R' : randomNumber < 97 ? 'SR' : 'SSR';
    const result = answerCorrect ? '正解です！' : '残念ですが、不正解です。';
    const resultImagePrefix = answerCorrect ? 'correct' : 'incorrect';
    this.resultImage = `assets/feedback/${resultImagePrefix}_${rarity.toLowerCase()}.png`;
    this.resultDescription = `${result}(レアリティ:${rarity})`;
  }

  onSubmitFeedback(feedbackData: { feedback: 'good' | 'bad'; comment: string }) {
    this.isLoading = true;
    const uid = generateUniqueHash(this.questionAll);
    
    const dataToSubmit = {
      uid: uid,
      questionJSON: this.questionAll,
      feedback: feedbackData.feedback,
      comment: feedbackData.comment,
      explain: this.explain
    };
    
    this.feedbackService.submitFeedback(dataToSubmit).subscribe(
      (response) => {
        console.log('Feedback submitted successfully', response);
        this.feedbackSubmitted = true;
        this.disableSubmitFeedbackButton = true;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error submitting feedback', error);
      }
    );
  }

}
