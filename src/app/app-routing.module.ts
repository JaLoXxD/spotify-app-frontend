import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/app.home.component';
import { PlaylistComponent } from './views/playlist/playlist.component';
import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate:[AuthGuard] },
    { path: 'login', component: LoginComponent},
    { path: 'playlist/:id', component: PlaylistComponent, canActivate:[AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
