import { ChangeDetectorRef, Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appNzSelectGridFocus]',
  standalone: true
})
export class NzSelectGridFocusDirective extends FocuslyDirective {
  protected elementRef: ElementRef;
  protected focuslyService: FocusSer;
  protected changeDetectorRef: ChangeDetectorRef;
  protected nzSelect = inject(NzSelectComponent);

  // This tracks if the mouse has been clicked on the dropdown.
  // Without this the dropdown closes before you can select an option
  private mouseClick = false;

  constructor() {
    const elementRef = inject(ElementRef);
    const gridFocusService = inject(GridFocusService);

    super(elementRef, gridFocusService, changeDetectorRef);
    this.elementRef = elementRef;
    this.gridFocusService = gridFocusService;
    this.changeDetectorRef = changeDetectorRef;

    this.selectCustomElement = () => {
      this.nzSelect.focus();
    };

    this.onElementFocus = () => {
      // For NzSelect elements we do not want to call the select() method so override it
    };
  }

  @HostListener('focusin', ['$event'])
  public onFocusIn(event: any): void {
    this.onFocus(event);
  }

  @HostListener('focusout', ['$event'])
  public onFocusOut(event: any): void {
    if (this.mouseClick === false) {
      this.nzSelect.nzOpen = false;
    } else {
      this.mouseClick = false;
    }
  }

  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: any): void {
    this.mouseClick = true;
  }

  // This allows enter key to be used on selecting dropdown options without saving
  @HostListener('keydown.enter', ['$event'])
  public onKeyDownEnter(event: any): void {
    event.stopPropagation();
    this.mouseClick = false;
  }
}
