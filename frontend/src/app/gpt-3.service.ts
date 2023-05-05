// gpt-3.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../environments/environment.openai';
import { prompts } from './prompts';
import { JsonExtractorService } from './json-extractor.service';

@Injectable({
  providedIn: 'root'
})
export class Gpt3Service {
  private apiKey: string = environment.openaiApiKey;

  private selectedPromptIndex = Math.floor(Math.random() * prompts.length);
  private selectedPrompt: string = prompts[this.selectedPromptIndex].prompt;

  constructor(private jsonExtractor: JsonExtractorService) {}

  async callGpt3Api(): Promise<{resultText: string, error: string}> {
    try {
      console.log("prompt: " + this.selectedPrompt);
      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-003/completions',
        {
          prompt: this.selectedPrompt,
          max_tokens: 320,
          n: 1,
          stop: null,
          temperature: 0.7,
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
        console.log('GPT-3 response text:', choice.text);
        const extractedJson = this.jsonExtractor.extractJson(choice.text);
        if (extractedJson) {
          return { resultText: JSON.stringify(extractedJson), error: '' };
        } else {
          console.error('Error fetching GPT-3 response: Unable to extract JSON');
          return { resultText: '', error: 'Unable to extract JSON' };
        }
      }
    } catch (error) {
      console.error('Error fetching GPT-3 response:', error);
    }
    return { resultText: '', error: '' };
  }
}
