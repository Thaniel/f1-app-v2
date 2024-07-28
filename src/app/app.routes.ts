import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'home',
        loadChildren: () => import('./pages/home/home.routes').then(m => m.HOME_ROUTES),
        canActivate: [authGuard],
    },
    {
        path: 'news',
        loadChildren: () => import('./pages/news/news.routes').then(m => m.NEWS_ROUTES),
        canActivate: [authGuard],
    },
    {
        path: 'races',
        loadChildren: () => import('./pages/races/races.route').then(m => m.RACES_ROUTES),
        canActivate: [authGuard],
    },
    {
        path: 'teams',
        loadChildren: () => import('./pages/teams/teams.route').then(m => m.TEAMS_ROUTES),
        canActivate: [authGuard],
    },
    {
        path: 'drivers',
        loadChildren: () => import('./pages/drivers/drivers.routes').then(m => m.DRIVERS_ROUTES),
        canActivate: [authGuard],
    },
    {
        path: 'standings',
        loadChildren: () => import('./pages/standings/standings.route').then(m => m.STANDINGS_ROUTES),
        canActivate: [authGuard],
    },
    {
        path: 'forum',
        loadChildren: () => import('./pages/forum/forum.routes').then(m => m.FORUM_ROUTES),
        canActivate: [authGuard],
    },
    {
        path: 'votes',
        loadChildren: () => import('./pages/votes/votes.routes').then(m => m.VOTES_ROUTES),
        canActivate: [authGuard],
    },
    {
        path: 'profile',
        loadChildren: () => import('./pages/profile/profile.routes').then(m => m.PROFILE_ROUTES),
        canActivate: [authGuard],
    },
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES),
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];