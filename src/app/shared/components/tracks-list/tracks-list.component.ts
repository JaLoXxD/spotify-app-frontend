import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackItem } from '../../../models/tracks-response.model';

@Component({
    selector: 'app-tracks-list',
    templateUrl: './tracks-list.component.html',
    styleUrls: ['./tracks-list.component.css'],
})
export class TracksListComponent implements OnInit {
    @ViewChild('tracksTable', { static: false }) tracksTable!: ElementRef;

    @Input() tracks!: Array<TrackItem>;
    @Input() pages: number = 1;

    @Output() changePage: EventEmitter<number> = new EventEmitter<number>();

    public currentPage: number = 0;
    public pagesItems: Array<number> = [];

    constructor(private _router: Router, private _route: ActivatedRoute) {}

    ngOnInit(): void {
        for (let i = 0; i < this.pages; i++) {
            this.pagesItems.push(i + 1);
        }
    }

    public calcTrackDuration(duration: number) {
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.round(duration / 1000 - minutes * 60);
        return `${minutes}:${this.formatDuration(seconds)}`;
    }

    public formatDuration(time: number) {
        return time < 10 ? `0${time}` : time;
    }

    public generateArray(): Array<number> {
        const start = this.currentPage < 3 ? 0 : this.currentPage - 3;
        const end = this.currentPage < 3 ? 5 : this.currentPage + 2;

        const currentPages = this.pagesItems.slice(start, end);

        if (
            currentPages.includes(this.currentPage + 1) &&
            currentPages[currentPages.length - 1] != this.currentPage + 1
        ) {
            return this.pagesItems.slice(start, end);
        } else if (
            currentPages[currentPages.length - 1] ===
            this.currentPage + 1
        ) {
            return this.pagesItems.slice(
                this.currentPage - 4,
                this.currentPage + 1
            );
        } else {
            return this.pagesItems.slice(
                this.currentPage,
                this.currentPage + 3
            );
        }
    }

    public onChangePage(pageNumber: number) {
        this.changePage.emit(pageNumber);
        this.currentPage = pageNumber - 1;
    }

    public playAudio() {
        
    }
}
