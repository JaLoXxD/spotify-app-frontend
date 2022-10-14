import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { PlayerService } from './services/player.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'Spotify';
    public token: string | null = null;

    constructor(private _playerService: PlayerService) {}

    ngOnInit() {
        this.token = localStorage.getItem('token');
        if(this.token){
            this._playerService.startSpotifyPlayer(this.token.replace('Bearer ',''))
        }
    }

    ngOnDestroy(): void {
        if(this._playerService.player){
            this._playerService.destroySpotifyPlayer();
        }
    }
}
