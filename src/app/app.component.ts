import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerService } from './services/player.service';
import { UserService } from './services/user.service';
import { HttpHeaders } from "@angular/common/http";

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
      if (localStorage.getItem('token')) {
        console.log('start token');
        if (!this._userService.userToken.value) {
            this._userService.userToken.next(
                localStorage.getItem('token')!
            );
        }
        const headers = new HttpHeaders({
            Authorization: localStorage.getItem('token') || '',
            'Content-Type': 'application/json',
        });

        const options = { headers };

        console.log(options);

        this.getUserProfile(options).then((res) => {
          const token = localStorage.getItem('token');
          if(token){
            console.log(this._playerService.player);
            if(!token) return;
            console.log('paso' + token);
            this._playerService.startSpotifyPlayer(
                token.replace('Bearer ', '')
            );

          }
        });
      }
    }

    public getUserProfile(options: Object): Promise<boolean> {
      return new Promise((resolve, reject) => {
          this._userService.getUserProfile(options).subscribe((res) => {
              console.log('user profile');
              console.log(res);
              this._userService.userInfo = res;
              this._userService.isPremium =
                  res.product === 'premium' ? true : false;
              resolve(true);
          });
      });
  }

    ngOnDestroy(): void {
        this._playerService.destroySpotifyPlayer();
    }
}
