// app.component.ts
import { Component } from '@angular/core';
import { Gpt3Service } from './gpt-3.service';
import { FeedbackService } from './feedback.service';
import { generateUniqueHash } from './utils';


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
  requestLimitReached = false;
  errorMessage: string = '';
  feedback: 'good' | 'bad' = 'good';
  comment: string = '';
  feedbackSubmitted = false;
  disableSubmitFeedbackButton = false;
  questionAll: string = '';

  constructor(private gpt3Service: Gpt3Service, private feedbackService: FeedbackService) {}

  // Generate a new question
  async generateQuestion() {
    // Check request limit
    // this.checkRequestLimit();
    // if (this.requestLimitReached) {
    //   return;
    // }

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
    this.correctAnswer = result.answer;
    this.isLoading = false;
    this.disableOptions = false;
  }

  // Handle error in API response
  private handleError() {
    this.errorMessage = 'Something went wrong, please try later.';
    this.isLoading = false;
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

  // Check the request limit and update the requestLimitReached property
  private checkRequestLimit() {
    const currentTime = new Date().getTime();
    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    requests.push(currentTime);
    const oneHourAgo = currentTime - 60 * 60 * 1000;
    const updatedRequests = requests.filter((requestTime: number) => requestTime >= oneHourAgo);

    localStorage.setItem('requests', JSON.stringify(updatedRequests));
    if (updatedRequests.length >= 10) {
      this.requestLimitReached = true;
      setTimeout(() => {
        this.requestLimitReached = false;
        this.checkRequestLimit();
      }, oneHourAgo - updatedRequests[0]);
    }
  }

  // Submit feedback
  submitFeedback() {
    this.isLoading = true;
    const uid = generateUniqueHash(this.questionAll);
    const feedbackData = {
      uid: uid,
      questionJSON: this.questionAll,
      feedback: this.feedback,
      comment: this.comment,
    };
  
    this.feedbackService.submitFeedback(feedbackData).subscribe(
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
