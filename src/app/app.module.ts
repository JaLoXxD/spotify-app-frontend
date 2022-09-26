import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
/* COMPONENTS */
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/app-navbar.component';
import { HomeComponent } from './views/home/app.home.component';
import { LatestTracksComponent } from './components/latest-tracks/latest-tracks.component';
import { PlaylistsGridComponent } from './components/playlists/grid/playlists-grid.component';
import { PlayerComponent } from './components/player/player.component';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        HomeComponent,
        LatestTracksComponent,
        PlaylistsGridComponent,
        PlayerComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
