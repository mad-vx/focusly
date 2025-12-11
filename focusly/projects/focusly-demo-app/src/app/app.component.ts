import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NgZorroComponent } from './components/ng-zorro/ng-zorro.component';
import { VanillaHtmlComponent } from './components/vanilla-html/vanilla-html.component';
import { FocuslyConfigComponent } from 'focusly-config';
import { FOCUSLY_SERVICE_API, FocuslyKeyMap } from '@zaybu/focusly';

@Component({
  selector: 'app-root',
  imports: [NgZorroComponent, VanillaHtmlComponent, FocuslyConfigComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit, OnDestroy {
  toolkit = signal<'none' | 'ngzorro'>('none');

  readonly showConfig = signal(false);
  readonly showToolkitInfo = signal(false);

  focuslyService = inject(FOCUSLY_SERVICE_API);
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

  ngOnInit(): void {
    window.focuslyTestApi = {
      updateKeymap: (keymap: FocuslyKeyMap) => {
        this.focuslyService.updateKeymap(keymap);
      },
    };
  }

  ngOnDestroy(): void {
    if (window.focuslyTestApi) {
      delete window.focuslyTestApi;
    }
  }
}
