import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  question: string = '';
  options: string[] = [];
  correctAnswer: string = '';
  showAnswer: boolean = false;
  resultImage: string = '';
  selectedAnswer: string = '';
  resultDescription: string = '';
  hideSubmitButton = false;
  isLoading: boolean = false;

  generateQuestion() {
    this.showAnswer = false;
    this.hideSubmitButton = false;
    this.resultImage = '';
    this.selectedAnswer = '';
    this.question =
      '後輩「おかわりを注文しましょうか。」\n先輩「いや、もう間に合っているよ。」\n間に合っている＝？';
    this.options = [
      '時間通りに来る',
      '十分である',
    ];
    this.correctAnswer = '十分である';
  }

  selectAnswer(answer: string) {
    this.selectedAnswer = answer;
  }

  submitAnswer() {
    this.showAnswer = true;
    this.hideSubmitButton = true;
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;

      if (this.selectedAnswer === this.correctAnswer) {
        const randomNumber = Math.random() * 100;
        if (randomNumber < 79) {
          this.resultImage = 'assets/feedback/correct_r.png';
          this.resultDescription = '答對了！(稀有度:R)';
        } else if (randomNumber >= 79 && randomNumber < 97) {
          this.resultImage = 'assets/feedback/correct_sr.png';
          this.resultDescription = '答對了！(稀有度:SR)';
        } else {
          this.resultImage = 'assets/feedback/correct_ssr.png';
          this.resultDescription = '答對了！(稀有度:SSR)';
        }
      } else {
        const randomNumber = Math.random() * 100;
        if (randomNumber < 79) {
          this.resultImage = 'assets/feedback/incorrect_r.png';
          this.resultDescription = '答錯了！(稀有度:R)';
        } else if (randomNumber >= 79 && randomNumber < 97) {
          this.resultImage = 'assets/feedback/incorrect_sr.png';
          this.resultDescription = '答錯了！(稀有度:SR)';
        } else {
          this.resultImage = 'assets/feedback/incorrect_ssr.png';
          this.resultDescription = '答錯了！(稀有度:SSR)';
        }
      }
    }, 1000);
  }
}
