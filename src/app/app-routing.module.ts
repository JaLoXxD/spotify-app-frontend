import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/app.home.component';
import { PlaylistComponent } from './views/playlist/playlist.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'playlist/:id', component: PlaylistComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
