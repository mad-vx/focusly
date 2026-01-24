import { Component } from '@angular/core';
import { FocuslyDirective } from '@zaybu/focusly';
import { NzInputNumberFocusDirective, NzSelectFocusDirective } from '@zaybu/focusly-nz';
import { BaseComponent } from '../base/base.component';
import { FormsModule } from '@angular/forms';
import { BaseDemoGrid } from '../abstract/base-demo-grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { BaseFullComponent } from '../base-full/base-full.component';

@Component({
  selector: 'app-ng-zorro',
  imports: [
    NzSelectModule,
    NzSelectFocusDirective,
    NzInputNumberFocusDirective,
    FormsModule,
    BaseComponent,
    BaseFullComponent,
    NzInputNumberModule,
    NzInputNumberFocusDirective,
    NzSliderModule,
    NzDatePickerModule,
    NzRadioModule,
    NzButtonModule,
    FocuslyDirective
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
