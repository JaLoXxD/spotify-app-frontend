import { Component, Input, OnInit } from '@angular/core';
import { playlistItem } from '../../../models/user-playlists-response.model';
import { UserService } from '../../../services/user.service';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
    selector: 'app-playlists-grid',
    templateUrl: './playlists-grid.component.html',
    styleUrls: ['./playlists-grid.component.css'],
})
export class PlaylistsGridComponent implements OnInit {
    public playlists: playlistItem[] = [];

    public placeholderPlaylistImg: string =
        'https://via.placeholder.com/450x350';

    constructor(private _userService: UserService, private _router: Router) {}

    ngOnInit(): void {
        if (localStorage.getItem('token')) {
            const headers = new HttpHeaders({
                Authorization: this._userService.userToken || '',
                'Content-Type': 'application/json',
            });

            const options = { headers };
            this.getUserPlaylists(options, 5);
        }
    }

    public getUserPlaylists(options: Object, limit: number) {
        this._userService.getUserPlaylists(options, limit).subscribe((resp) => {
            console.log('playlists');
            console.log(resp);
            this.playlists = resp.items;
        });
    }

    public playlistInfo(id: string) {
        this._router.navigate(['/playlist', id]);
    }
}
