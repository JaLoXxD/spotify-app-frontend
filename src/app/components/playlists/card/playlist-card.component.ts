import { Component, Input } from '@angular/core';
import { playlistItem } from '../../../models/user-playlists-response.model';
import { Router } from '@angular/router';
import { PlayerService } from 'src/app/services';

@Component({
    selector: "app-playlist-card",
    templateUrl: "./playlist-card.component.html",
    styleUrls: ["./playlist-card.component.css"]
})
export class PlaylistCard {
    @Input() playlist!: playlistItem;

    public placeholderPlaylistImg: string =
    'https://via.placeholder.com/450x350';

    constructor(private _router: Router, private _playerService: PlayerService){}

    public playlistInfo(id: string) {
        this._router.navigate([`/playlists`, id]);
    }

    public playPlaylist() {
        this._playerService.playType = 'playlist';
    }
}