import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserProfileResponseModel } from '../models/user-profile-response.model';
import { UserPlaylistsResponseModel } from '../models/user-playlists-response.model';
import { UserFollowedArtistsResponse } from '../models/user-followed-artists-response.model';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _spotifyApiUrl = environment.spotifyApiUrl;
    public userInfo!: UserProfileResponseModel;
    public userToken: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    public isPremium: boolean = false;

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
        options: Object,
        limit: number | null
    ): Observable<UserPlaylistsResponseModel> {

        const url = limit
            ? `${this._spotifyApiUrl}/me/playlists?limit=${limit}`
            : `${this._spotifyApiUrl}/me/playlists`; 

        return this._http.get<UserPlaylistsResponseModel>(
            url,
            options
        );
    }

    public getUserFollowedArtists(
        options: Object
    ): Observable<UserFollowedArtistsResponse> {
        return this._http.get<UserFollowedArtistsResponse>(
            `${this._spotifyApiUrl}/me/following?type=artist`,
            options
        );
    }
}
