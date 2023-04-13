import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  constructor() {}

  copyToClipboard() {
    const btcAddress = document.getElementById('btcAddress') as HTMLElement;
    const textArea = document.createElement('textarea');
    textArea.value = btcAddress.textContent || '';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    const copySuccessMsg = document.getElementById('copySuccessMsg');
    if (copySuccessMsg) {
      copySuccessMsg.style.display = 'inline';

      setTimeout(() => {
        copySuccessMsg.style.display = 'none';
      }, 2000);
    }
  }
}
