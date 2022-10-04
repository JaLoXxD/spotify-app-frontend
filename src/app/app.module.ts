import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
/* COMPONENTS */
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/app-navbar.component';
import { HomeComponent } from './views/home/app.home.component';
import { LatestTracksComponent } from './components/latest-tracks/latest-tracks.component';
import { PlaylistsGridComponent } from './components/playlists/grid/playlists-grid.component';
import { PlayerComponent } from './components/player/player.component';
import { dropdownDirective } from './shared/dropdown.directive';
import { FollowedArtists } from './components/followed-artists/followed-artists.component';
import { PlaylistComponent } from './views/playlist/playlist.component';
import { InfoLabelComponent } from './shared/components/info-label/info-label.component';
import { TracksListComponent } from './shared/components/tracks-list/tracks-list.component';
import { LoginComponent } from './views/login/login.component';
/* INTERCEPTORS */
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        HomeComponent,
        LatestTracksComponent,
        PlaylistsGridComponent,
        PlayerComponent,
        FollowedArtists,
        PlaylistComponent,
        dropdownDirective,
        InfoLabelComponent,
        TracksListComponent,
        LoginComponent,
        SpinnerComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
