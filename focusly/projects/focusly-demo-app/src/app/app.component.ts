import { Component, signal } from '@angular/core';
import { FocuslyEnterKeySubscriberComponent } from '@zaybu/focusly';
import { FocuslyDirective, FocuslyListenerComponent } from '@zaybu/focusly';

@Component({
  selector: 'app-root',
  imports: [FocuslyDirective, FocuslyListenerComponent, FocuslyEnterKeySubscriberComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  title = 'focusly-demo';

  columns = [0,1,2,3,4,5,6]; 
  rows = [0,1,2,3,4,5,6];

  activeSaveButton = signal<1 | 2 | null>(null);
  lastActionMessage: string | null = null;
  showToast = false;
  private toastTimeoutHandle: any;
  private buttonFlashHandle: any;

  onEnterKey(): void {
    this.triggerFeedback(1, 'Grid 1 action triggered');
  }

  onEnterKey2(): void {
    this.triggerFeedback(2, 'Grid 2 action triggered');
  }

  private triggerFeedback(which: 1 | 2, msg: string): void {
    this.activeSaveButton.set(which);

    if (this.buttonFlashHandle) {
      clearTimeout(this.buttonFlashHandle);
    }
    this.buttonFlashHandle = setTimeout(() => {
      this.activeSaveButton.set(null);
    }, 1000); 

    this.lastActionMessage = msg;
    this.showToast = true;

    if (this.toastTimeoutHandle) {
      clearTimeout(this.toastTimeoutHandle);
    }
    this.toastTimeoutHandle = setTimeout(() => {
      this.showToast = false;
    }, 1500);
  }
}
