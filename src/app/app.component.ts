import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService } from './services/player.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'Spotify';

    constructor(private _playerService: PlayerService) {}

    ngOnInit() {
        const token = localStorage.getItem('token');
        if(token){
            this._playerService.startSpotifyPlayer(token.replace('Bearer ',''))
        }
        // this._playerService.startPlayerListeners();
    }

    ngOnDestroy(): void {
        if(this._playerService.player){
            this._playerService.destroySpotifyPlayer();
        }
    }
}
