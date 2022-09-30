import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { HttpHeaders } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { PlaylistInfoResponse } from '../../models/playlist-info-response.model';
import { TrackItem } from '../../models/tracks-response.model';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css'],
})
export class PlaylistComponent implements OnInit {
    public playlistInfo!: PlaylistInfoResponse;
    public tracks!: TrackItem[];
    public pages: number = 0;

    private _offset = 0;
    private _playlistId: string = '';

    constructor(
        private _playlistService: PlaylistService,
        private _route: ActivatedRoute,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        if (!localStorage.getItem('token')) {
            return;
        }
        console.log(this._userService);
        this._route.params.subscribe((params) => {
            console.log(params);
            const options = this.createOptions();
            this._playlistId = params['id'];
            this.getPlaylist(this._playlistId, options);
            this.getPlaylistItems(
                this._playlistId,
                '10',
                this._offset.toString(),
                options
            );
        });
    }

    public getPlaylist(id: string, options: Object) {
        this._playlistService.getPlaylist(id, options).subscribe((resp) => {
            this.playlistInfo = resp;
            console.log(this.playlistInfo);
        });
    }

    public getPlaylistItems(
        id: string,
        limit: string,
        offset: string,
        options: Object
    ) {
        this._playlistService
            .getPlaylistTracks(id, limit, offset, options)
            .subscribe((resp) => {
                this.tracks = resp.items;
                this.pages = Math.ceil(resp.total / 10);
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth',
                });
            });
    }

    public createOptions(): Object {
        const headers = new HttpHeaders({
            Authorization:
                this._userService.userToken ||
                localStorage.getItem('token') ||
                '',
            'Content-Type': 'application/json',
        });

        const options = { headers };

        return options;
    }

    getUserById(userId: string) {}

    onChangePage(pageNumber: number) {
        this._offset = (pageNumber - 1) * 10;
        const options = this.createOptions();
        this.getPlaylistItems(
            this._playlistId,
            '10',
            this._offset.toString(),
            options
        );
    }
}
