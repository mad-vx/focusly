import { Component } from '@angular/core';
import { NzInputNumberFocusDirective, NzSelectFocusDirective } from '@zaybu/focusly-nz';
import { BaseComponent } from '../base/base.component';
import { FormsModule } from '@angular/forms';
import { BaseDemoGrid } from '../abstract/base-demo-grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'app-ng-zorro',
  imports: [
    NzSelectModule,
    NzSelectFocusDirective,
    NzInputNumberFocusDirective,
    FormsModule,
    BaseComponent,
    NzInputNumberModule,
    NzInputNumberFocusDirective,
  ],
  templateUrl: './ng-zorro.component.html',
  standalone: true,
})
export class NgZorroComponent extends BaseDemoGrid {
  override title: string = 'NgZorro - Focusly Demo';

  constructor() {
    super();
  }
}
