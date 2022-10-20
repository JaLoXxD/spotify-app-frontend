import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService } from './services/player.service';
import { UserService } from './services/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'Spotify';
    public token: string | null = null;

    constructor(
        private _playerService: PlayerService,
        private _userService: UserService,
    ) {}

    ngOnInit() {
        this._userService.userToken.subscribe(token => {
            console.log(token);
            console.log(this._playerService.player);
            if(!token) return;
            console.log('paso' + token);
            this._playerService.startSpotifyPlayer(
                token.replace('Bearer ', '')
            );
        });
    }

    ngOnDestroy(): void {
        this._playerService.destroySpotifyPlayer();
    }
}
