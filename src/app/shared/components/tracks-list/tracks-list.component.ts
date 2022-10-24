import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackItem } from '../../../models/tracks-response.model';
import { PlayerService } from '../../../services/player.service';
import { HttpHeaders } from '@angular/common/http';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-tracks-list',
    templateUrl: './tracks-list.component.html',
    styleUrls: ['./tracks-list.component.css'],
})
export class TracksListComponent implements OnInit {
    @Input() tracks: Array<TrackItem> | null = null;
    @Input() pagination: boolean = false;
    @Input() pages: number = 1;

    @Output() changePage: EventEmitter<number> = new EventEmitter<number>();

    public currentPage: number = 0;
    public pagesItems: Array<number> = [];

    constructor(private _playerService: PlayerService, private _userService: UserService) {}

    ngOnInit(): void {
        for (let i = 0; i < this.pages; i++) {
            this.pagesItems.push(i + 1);
        }
        console.log(this.tracks);
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
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }

    public playSong(uri: string) {
        if (!this.currentDevice) {
            return;
        }
        const body = {
            position_ms: 0,
            uris: [uri],
        };
        const headers = new HttpHeaders({
            Authorization: this._userService.userToken.value || '',
            'Content-Type': 'application/json',
        });
        const options = { headers };
        this._playerService
            .startOrResumePlayer(this.currentDevice, body, options)
            .subscribe({
                next: (res) => {
                    this._playerService.isPlaying = true;
                },
                error: (err) => {
                    console.log(err);
                },
            });
    };

    public get currentDevice(): string | undefined {
        return this._playerService.currentDevice;
    }
}
