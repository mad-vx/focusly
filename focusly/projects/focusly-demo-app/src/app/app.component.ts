import { Component, signal } from '@angular/core';
import { NgZorroComponent } from "./components/ng-zorro/ng-zorro.component";

@Component({
  selector: 'app-root',
  imports: [NgZorroComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  toolkit = signal<'none' | 'ngzorro'>('none');
}
