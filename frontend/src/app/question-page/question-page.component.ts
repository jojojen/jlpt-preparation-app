// question-page/question-page.component.ts
import { Component, OnInit } from '@angular/core';
import { Gpt3Service } from 'src/app/gpt-3.service';
import { FeedbackService } from 'src/app/feedback.service';
import { generateUniqueHash } from 'src/app/utils';
import { FeedbackComponent } from 'src/app/feedback/feedback.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { stickers } from 'src/app/stickers';
import { AuthService } from 'src/app/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-question-page',
  templateUrl: './question-page.component.html',
  styleUrls: ['./question-page.component.css'],
})
export class QuestionPageComponent {
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
  loggedIn: boolean = false;
  showAnswerExplain: boolean = false;

  constructor(
    private gpt3Service: Gpt3Service,
    private feedbackService: FeedbackService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      if(user) {
        const uid = user.uid;
        console.log("uid:" + uid);
      }
      this.loggedIn = !!user;
    });
  }
  
  updateLoggedInStatus(loggedIn: boolean) {
    this.loggedIn = loggedIn;
  }

  async getQuestionFromCollection() {

    // const API_BASE_URL = 'https://jlpt-app-backend.vercel.app';
    // const API_BASE_URL = 'https://jlpt-app-backend-jojojen.vercel.app';
    const API_BASE_URL = environment.API_BASE_URL;

    this.disableSubmitFeedbackButton = false;
    this.feedbackSubmitted = false;
    this.showFeedbackComponent = false;

    this.prepareForNewQuestion();

    try {
      const n = 10; // Number of questions to retrieve
      const questions = await this.http.get<Question[]>(`${API_BASE_URL}/questions/random?n=${n}`).toPromise();
      // const questions = await this.http.get<{ questionJSON: string }[]>(`${API_BASE_URL}/questions/random?n=${n}`).toPromise();
      
      if (!questions || questions.length === 0) {
        throw new Error('No questions received');
      }

      // Log the whole question object content for each question
      // questions.forEach((question, index) => {
      //   console.log(`Question ${index + 1}:`, question);
      // });
      
      // const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      // const resultText = randomQuestion.questionJSON;

      const questionWithHighestPositiveFeedback = questions.reduce((prev, current) => {
        const prevPositiveFeedbacks = prev.feedbacks.filter((feedback) => feedback.rating === 1).length;
        const currentPositiveFeedbacks = current.feedbacks.filter((feedback) => feedback.rating === 1).length;
  
        return prevPositiveFeedbacks >= currentPositiveFeedbacks ? prev : current;
      });
  
      const resultText = questionWithHighestPositiveFeedback.questionJSON;
      const result = JSON.parse(resultText);

      console.log("resultText: " + resultText);

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

        // Save the generated question to the database
        // const API_BASE_URL = 'https://jlpt-app-backend.vercel.app';
        // const API_BASE_URL = 'https://jlpt-app-backend-jojojen.vercel.app';
        const API_BASE_URL = environment.API_BASE_URL;

        const questionData = JSON.parse(resultText);
        const questionToSave = {
          _id: generateUniqueHash(resultText), // Generate a unique ID for the question
          questionJSON: resultText,
          explain: questionData.explain,
        };

        await this.http.post(`${API_BASE_URL}/question`, questionToSave).toPromise();
          console.log('Question saved to the database:', questionToSave);
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
    this.showAnswerExplain = false;
  }

  // Handle successful API response
  private handleSuccess(resultText: string) {
    const result = JSON.parse(resultText);
    this.questionAll = resultText;
    this.question = result.text;
    this.options = result.options;
    this.explain = result.explain;
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
    this.showAnswerExplain = false;
  }

  // Evaluate the selected answer
  private evaluateAnswer() {
    this.isLoading = false;
    const answerCorrect = this.selectedAnswer === this.correctAnswer;
    const randomNumber = Math.random() * 100;
    this.setResultImageAndDescription(answerCorrect, randomNumber);
    this.disableGenerateQuestionButton = false;
    this.showAnswerExplain = true;
  }

  // Set result image and description based on answer correctness and a random number
  private async setResultImageAndDescription(answerCorrect: boolean, randomNumber: number) {
    const rarity = randomNumber < 79 ? 'R' : randomNumber < 97 ? 'SR' : 'SSR';
    const result = answerCorrect ? '正解です！' : '残念ですが、不正解です。';
    const resultType = answerCorrect ? 'correct' : 'incorrect';
  
    // Filter stickers matching the rarity and resultType
    const matchingStickers = stickers.filter(
      (sticker) => sticker.rarity === rarity && sticker.type === resultType
    );
  
    if (matchingStickers.length > 0) {
      // Randomly pick one sticker from matching stickers
      const randomIndex = Math.floor(Math.random() * matchingStickers.length);
      const randomSticker = matchingStickers[randomIndex];
      this.resultImage = randomSticker.url;

      // update album
      if (this.loggedIn) {
        try {
          const user = await this.authService.user$.pipe(first()).toPromise();
          const userData = await this.authService.getUserData(user.uid).toPromise();
          const stickerInAlbum = userData.album.includes(randomSticker.name);
    
          if (!stickerInAlbum) {
            // Update user's album
            userData.album.push(randomSticker.name);
            await this.authService.updateUserData(user.uid, userData).toPromise();
            console.log('Sticker added to user album:', randomSticker.name);
          }
        } catch (error) {
          console.error('Error updating user album:', error);
        }
      }
    } else {
      console.error('No matching sticker found');
      this.resultImage = '';
    }
  
    this.resultDescription = `${result}(レアリティ:${rarity})`;
  
  }
  

  onSubmitFeedback(feedbackData: { feedback: 'good' | 'bad'; comment: string }) {
    this.isLoading = true;
    const uid = generateUniqueHash(this.questionAll);
  
    const dataToSubmit = {
      uid: uid,
      feedback: feedbackData.feedback,
      comment: feedbackData.comment
    };
  
    this.feedbackService.addCommentToQuestion(dataToSubmit).subscribe(
      (response) => {
        console.log('Comment added to the question', response);
        this.feedbackSubmitted = true;
        this.disableSubmitFeedbackButton = true;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error adding comment to the question', error);
        this.isLoading = false;
      }
    );
  }
}

// Add the interface definition within the same file as the AppComponent class
interface Question {
  _id: string;
  questionJSON: string;
  explain: string;
  feedbacks: {
    rating: number;
    comment: string;
  }[];
}