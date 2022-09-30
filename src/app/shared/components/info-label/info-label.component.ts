import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-info-label',
    templateUrl: './info-label.component.html',
    styleUrls: ['./info-label.component.css'],
})
export class InfoLabelComponent {
    @Input() text: string | null | undefined = '';
    @Input() centered: boolean = false;
}
