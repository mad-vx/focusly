import { Component, signal } from '@angular/core';
import { NgZorroComponent } from "./components/ng-zorro/ng-zorro.component";
import { VanillaHtmlComponent } from './components/vanilla-html/vanilla-html.component';

@Component({
  selector: 'app-root',
  imports: [NgZorroComponent, VanillaHtmlComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  toolkit = signal<'none' | 'ngzorro'>('none');
}
