import {
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
} from '@angular/core';

@Directive({
    selector: '[appDropdown]',
})
export class dropdownDirective {
    @HostBinding('class.active') class = false;

    constructor(private elRef: ElementRef) {}

    @HostListener('document:click', ['$event']) clickBtn(eventData: Event) {
        if (!this.elRef.nativeElement.contains(eventData.target)) {
            this.class = false;
        } else {
            this.class = !this.class;
        }
    }
}
