import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { HttpHeaders } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { PlaylistInfoResponse } from '../../models/playlist-info-response.model';
import { TrackItem } from '../../models/tracks-response.model';
import { PlayerService } from '../../services/player.service';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css'],
})
export class PlaylistComponent implements OnInit {
    public isLoading: boolean = true;
    public playlistInfo!: PlaylistInfoResponse;
    public tracks!: TrackItem[];
    public pages: number = 0;

    private _offset = 0;
    private _playlistId: string = '';

    constructor(
        private _playlistService: PlaylistService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _playerService: PlayerService
    ) {}

    ngOnInit(): void {
        if (!localStorage.getItem('token')) {
            return;
        }
        this._route.params.subscribe(async (params) => {
            const options = this.createOptions();
            this._playlistId = params['id'];
            this.playlistInfo = await this._playlistService.getPlaylist(
                this._playlistId,
                options
            );
            const tracksRes = await this._playlistService.getPlaylistTracks(
                this._playlistId,
                '10',
                this._offset.toString(),
                options
            );
            const playbackTracksUris: Array<string> = [];
            if (this._playerService.playType === 'playlist') {
                tracksRes.items.forEach((item: any) => {
                    playbackTracksUris.push(item.track.uri);
                });
                console.log(playbackTracksUris);
                this._playerService.playSongs(playbackTracksUris);
            }
            this.tracks = tracksRes.items;
            this.pages = Math.ceil(tracksRes.total / 10);
            this.isLoading = false;
        });
    }

    public createOptions(): Object {
        const headers = new HttpHeaders({
            Authorization:
                this._userService.userToken.value ||
                localStorage.getItem('token') ||
                '',
            'Content-Type': 'application/json',
        });

        const options = { headers };

        return options;
    }

    async onChangePage(pageNumber: number) {
        this._offset = (pageNumber - 1) * 10;
        const options = this.createOptions();
        const tracksRes = await this._playlistService.getPlaylistTracks(
            this._playlistId,
            '10',
            this._offset.toString(),
            options
        );
        this.tracks = tracksRes.items;
    }

    goBack() {
        this._router.navigate(['/playlists']);
    }
}
