import { Component, signal } from '@angular/core';
import { NgZorroComponent } from './components/ng-zorro/ng-zorro.component';
import { VanillaHtmlComponent } from './components/vanilla-html/vanilla-html.component';
import { FocuslyConfigComponent } from 'focusly-config';

@Component({
  selector: 'app-root',
  imports: [NgZorroComponent, VanillaHtmlComponent, FocuslyConfigComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  toolkit = signal<'none' | 'ngzorro'>('none');

  readonly showConfig = signal(false);
  readonly showToolkitInfo = signal(false);

  openConfig(): void {
    this.showConfig.set(true);
  }

  closeConfig(): void {
    this.showConfig.set(false);
  }

  openToolkitInfo(): void {
    this.showToolkitInfo.set(true);
  }

  closeToolkitInfo(): void {
    this.showToolkitInfo.set(false);
  }
}
