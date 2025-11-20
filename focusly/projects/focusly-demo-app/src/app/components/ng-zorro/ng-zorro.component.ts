import { Component, inject } from '@angular/core';
import { NzSelectFocusDirective } from '@zaybu/focusly-nz';
import { BaseComponent } from '../base/base.component';
import { FormsModule } from '@angular/forms';
import { BaseDemoGrid } from '../abstract/base-demo-grid';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-ng-zorro',
  imports: [ NzSelectModule, NzSelectFocusDirective, FormsModule , BaseComponent ],
  templateUrl: './ng-zorro.component.html',
  styleUrl: './ng-zorro.component.scss',
  standalone: true
})
export class NgZorroComponent extends BaseDemoGrid {
  override title: string = "NgZorro - Focusly Demo";

  constructor() {
    super();
  }
}
