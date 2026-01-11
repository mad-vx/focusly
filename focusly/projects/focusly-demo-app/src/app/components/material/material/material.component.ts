import { Component } from '@angular/core';
import { BaseDemoGrid } from '../../abstract/base-demo-grid';
import { FocuslyDirective } from '@zaybu/focusly';
import { BaseComponent } from '../../base/base.component';
import { FormsModule } from '@angular/forms';
//import { MatInputModule } from '@angular/material/input';
//import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-material',
  imports: [FormsModule, FocuslyDirective, BaseComponent],
  templateUrl: './material.component.html',
})
export class MaterialComponent extends BaseDemoGrid {
  override title: string = 'Material UI - Focusly Demo';
}
