import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tab-instructions',
  imports: [],
  templateUrl: './tab-instructions.component.html',
  styleUrl: './tab-instructions.component.scss',
})
export class TabInstructionsComponent {
  @Output() selectFirst = new EventEmitter<void>();

  selectFirstField() {
    this.selectFirst.emit();
  }
}
