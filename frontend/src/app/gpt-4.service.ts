// gpt-4.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../environments/environment.openai';
import { prompts } from './prompts';
import { JsonExtractorService } from './json-extractor.service';

@Injectable({
  providedIn: 'root'
})
export class Gpt4Service {
  private apiKey: string = environment.openaiApiKey;

  private selectedPromptIndex = Math.floor(Math.random() * prompts.length);
  private selectedPrompt: string = prompts[this.selectedPromptIndex].prompt;

  constructor(private jsonExtractor: JsonExtractorService) {}

  async callGpt4Api(): Promise<{resultText: string, error: string}> {
    try {
      console.log("prompt: " + this.selectedPrompt);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',  // Adjust the API endpoint if needed
        {
          model: 'gpt-4',
          messages: [
            {"role": "system", "content": "You are a professional japanese tutor AI proficient in JLPT questions and having extensive experience in teaching Japanese."},
            {"role": "user", "content": this.selectedPrompt}
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      if (response.data.choices && response.data.choices.length > 0) {
        const choice = response.data.choices[0];
        console.log('GPT-4 response text:', choice.message.content);
        const extractedJson = this.jsonExtractor.extractJson(choice.message.content);
        if (extractedJson) {
          return { resultText: JSON.stringify(extractedJson), error: '' };
        } else {
          console.error('Error fetching GPT-4 response: Unable to extract JSON');
          return { resultText: '', error: 'Unable to extract JSON' };
        }
      }
    } catch (error) {
      console.error('Error fetching GPT-4 response:', error);
    }
    return { resultText: '', error: '' };
  }
}
