import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserProfileResponseModel } from '../models/user-profile-response.model';
import { UserPlaylistsResponseModel } from '../models/user-playlists-response.model';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _spotifyApiUrl = environment.spotifyApiUrl;

    public userInfo!: UserProfileResponseModel;
    public userToken: string | null = null;

    constructor(private _http: HttpClient) {}

    public getUserProfile(
        options: Object
    ): Observable<UserProfileResponseModel> {
        return this._http.get<UserProfileResponseModel>(
            `${this._spotifyApiUrl}/me`,
            options
        );
    }

    public getUserPlaylists(
        options: Object
    ): Observable<UserPlaylistsResponseModel> {
        return this._http.get<UserPlaylistsResponseModel>(
            `${this._spotifyApiUrl}/me/playlists`,
            options
        );
    }

    public getUserFollowedArtists(options: Object): Observable<any> {
        return this._http.get<any>(
            `${this._spotifyApiUrl}/me/following`,
            options
        );
    }
}
