import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/app.home.component';
import { PlaylistComponent } from './views/playlist/playlist.component';
import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { PlaylistsComponent } from './views/playlists/playlists.component';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    {
        path: 'playlists',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PlaylistsComponent },
            {
                path: ':id',
                component: PlaylistComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
