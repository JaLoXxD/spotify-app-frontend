import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services';
import { ArtistsItem } from '../../models/user-followed-artists-response.model';

@Component({
    selector: 'app-followed-artists',
    templateUrl: './followed-artists.component.html',
    styleUrls: ['./followed-artists.component.css'],
})
export class FollowedArtists implements OnInit {
    @Output() totalFollowedArtists: EventEmitter<number> =
        new EventEmitter<number>();

    public followedArtists!: ArtistsItem[];
    public placeholderArtistImg: string = 'https://via.placeholder.com/450x350';

    constructor(private _userService: UserService) {}

    ngOnInit(): void {
        if (localStorage.getItem('token')) {
            const headers = new HttpHeaders({
                Authorization: this._userService.userToken.value || '',
                'Content-Type': 'application/json',
            });

            const options = { headers };
            this.getFollowedArtists(options);
        }
    }

    getFollowedArtists(options: Object) {
        this._userService
            .getUserFollowedArtists(options)
            .pipe(
                map((resp) => {
                    return resp.artists;
                })
            )
            .subscribe({
                next: (resp) => {
                    console.log(resp);
                    this.sendTotalFollowedArtists(resp.total);
                    this.followedArtists = resp.items;
                },
            });
    }

    sendTotalFollowedArtists(total: number) {
        this.totalFollowedArtists.emit(total);
    }
}
