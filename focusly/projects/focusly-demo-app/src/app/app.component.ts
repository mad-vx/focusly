import { Component, inject, signal } from '@angular/core';
import { KeyboardService } from './services/keyboard-service';
import { KeyDisplayComponent } from "./components/keyboard.component";
import { NgZorroComponent } from "./components/ng-zorro/ng-zorro.component";
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-root',
  imports: [KeyDisplayComponent, NgZorroComponent, NzSelectModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  keyboardService = inject(KeyboardService);

  title = 'focusly-demo';

  columns = [0,1,2,3,4,5,6]; 
  rows = [0,1,2,3,4,5,6];

  activeSaveButton = signal<1 | 2 | null>(null);
  lastActionMessage: string | null = null;
  showToast = false;
  private toastTimeoutHandle: any;
  private buttonFlashHandle: any;

  onEnterKey(): void {
    this.triggerFeedback(1, 'Saving Trading Information');
  }

  onEnterKey2(): void {
    this.triggerFeedback(2, 'Save Customer Details');
  }

  onKeyPress($event: any) {
    console.log($event);
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
