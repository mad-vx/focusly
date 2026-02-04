import { Component, signal } from '@angular/core';
import { FocuslyDirective, FocuslyGroupHostDirective } from '@zaybu/focusly';
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
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { FocuslyShortcutDirective } from '@zaybu/focusly';
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
    NzTabsModule,
    FocuslyDirective,
    FocuslyGroupHostDirective,
    FocuslyShortcutDirective
  ],
  templateUrl: './ng-zorro.component.html',
  standalone: true,
})
export class NgZorroComponent extends BaseDemoGrid {
  override title: string = 'NgZorro - Focusly Demo';

  selectedIndex = signal(0);
  constructor() {
    super();
  }

  selectIndex(index: number) {
    console.log(index);
    this.selectedIndex.set(index);
  }
}
