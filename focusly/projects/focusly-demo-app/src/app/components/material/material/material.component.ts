import { Component } from '@angular/core';
import { BaseDemoGrid } from '../../abstract/base-demo-grid';
import { FocuslyDirective } from '@zaybu/focusly';
import { BaseComponent } from '../../base/base.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectFocusDirective } from '@zaybu/focusly-material';
import { BaseFullComponent } from '../../base-full/base-full.component';

@Component({
  selector: 'app-material',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FocuslyDirective,
    BaseComponent,
    BaseFullComponent,
    MatSelectFocusDirective,
  ],
  templateUrl: './material.component.html',
  styleUrl: './material.component.scss',
})
export class MaterialComponent extends BaseDemoGrid {
  override title: string = 'Material UI - Focusly Demo';
}
