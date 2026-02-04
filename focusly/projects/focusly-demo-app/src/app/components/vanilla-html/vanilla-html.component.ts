import { Component } from '@angular/core';
import { FocuslyDirective } from '@zaybu/focusly';
import { BaseComponent } from '../base/base.component';
import { BaseFullComponent } from '../base-full/base-full.component';

@Component({
  selector: 'app-vanilla-html',
  imports: [FocuslyDirective, BaseComponent, BaseFullComponent],
  templateUrl: './vanilla-html.component.html',
  standalone: true,
})
export class VanillaHtmlComponent {}
