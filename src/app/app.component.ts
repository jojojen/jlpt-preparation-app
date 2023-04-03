import { Component } from '@angular/core';
import { Gpt3Service } from './gpt-3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
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

  constructor(private gpt3Service: Gpt3Service) {}

  async generateQuestion() {
    
    console.log('generateQuestion called');
    this.countRequests();
    if (this.requestLimitReached) {
      return;
    }

    this.disableOptions = true;
    this.isLoading = true;
    this.disableGenerateQuestionButton = true;
    this.showAnswer = false;
    this.hideSubmitButton = false;
    this.resultImage = '';
    this.selectedAnswer = '';

    try {
      // const resultText = await this.gpt3Service.callGpt3Api();
      const { resultText, error } = await this.gpt3Service.callGpt3Api();
      console.log("resultText:" + resultText);
      const result = JSON.parse(resultText);

      this.question = result.text;
      this.options = result.options;
      this.correctAnswer = result.answer;

      this.isLoading = false;
      this.disableOptions = false;
    } catch (error) {
      console.error('Error generating question:', error);
      this.errorMessage = 'Something go wrong, please try later.';
      this.isLoading = false;
    }
  }

  selectAnswer(answer: { id: string; text: string }) {
    if (!this.disableOptions) {
      this.selectedAnswer = answer.id;
      this.disableSubmitAnswerButton = false;
    }
  }

  submitAnswer() {
    this.showAnswer = true;
    this.hideSubmitButton = true;
    this.isLoading = true;
    this.disableSubmitAnswerButton = false;
    this.disableOptions = true;

    setTimeout(() => {
      this.isLoading = false;

      if (this.selectedAnswer === this.correctAnswer) {
        const randomNumber = Math.random() * 100;
        if (randomNumber < 79) {
          this.resultImage = 'assets/feedback/correct_r.png';
          this.resultDescription = '正解です！(レアリティ:R)';
        } else if (randomNumber >= 79 && randomNumber < 97) {
          this.resultImage = 'assets/feedback/correct_sr.png';
          this.resultDescription = '正解です！(レアリティ:SR)';
        } else {
          this.resultImage = 'assets/feedback/correct_ssr.png';
          this.resultDescription = '正解です！(レアリティ:SSR)';
        }
      } else {
        const randomNumber = Math.random() * 100;
        if (randomNumber < 79) {
          this.resultImage = 'assets/feedback/incorrect_r.png';
          this.resultDescription = '残念ですが、不正解です。(レアリティ:R)';
        } else if (randomNumber >= 79 && randomNumber < 97) {
          this.resultImage = 'assets/feedback/incorrect_sr.png';
          this.resultDescription = '残念ですが、不正解です。(レアリティ:SR)';
        } else {
          this.resultImage = 'assets/feedback/incorrect_ssr.png';
          this.resultDescription = '残念ですが、不正解です。(レアリティ:SSR)';
        }
      }
      this.disableGenerateQuestionButton = false;
    }, 500);
  }

  // Add this function to count requests and apply limits
  countRequests() {
    const currentTime = new Date().getTime();
    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    requests.push(currentTime);
    // Remove requests older than an hour
    const oneHourAgo = currentTime - 60 * 60 * 1000;
    const updatedRequests = requests.filter((requestTime: number) => requestTime >= oneHourAgo);

    localStorage.setItem('requests', JSON.stringify(updatedRequests));
    console.log('updatedRequests.length: ' + updatedRequests.length);
    if (updatedRequests.length >= 10) {
      this.requestLimitReached = true;
      setTimeout(() => {
        this.requestLimitReached = false;
        this.countRequests();
      }, oneHourAgo - updatedRequests[0]);
    }
  }
}