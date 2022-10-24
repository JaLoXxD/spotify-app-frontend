import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-info-label',
    templateUrl: './info-label.component.html',
    styleUrls: ['./info-label.component.css'],
})
export class InfoLabelComponent {
    @Input() centered: boolean = false;
}
