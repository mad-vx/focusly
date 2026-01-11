import { Component } from '@angular/core';
import { FocuslyDirective } from '@zaybu/focusly';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-vanilla-html',
  imports: [FocuslyDirective, BaseComponent],
  templateUrl: './vanilla-html.component.html',
  standalone: true,
})
export class VanillaHtmlComponent {}
