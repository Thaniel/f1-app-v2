import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        //loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES),
        loadChildren: () => import('./pages/home/home.routes').then(m => m.HOME_ROUTES),
        //canActivate: [loggedGuard]
    },
    {
        path: 'news',
        loadChildren: () => import('./pages/news/news.routes').then(m => m.NEWS_ROUTES),
    },
    {
        path: 'races',
        loadChildren: () => import('./pages/races/races.route').then(m => m.RACES_ROUTES),
    },
    {
        path: 'teams',
        loadChildren: () => import('./pages/teams/teams.route').then(m => m.TEAMS_ROUTES),
    },
    {
        path: 'drivers',
        loadChildren: () => import('./pages/drivers/drivers.routes').then(m => m.DRIVERS_ROUTES),
    },
    {
        path: 'standings',
        loadChildren: () => import('./pages/standings/standings.route').then(m => m.STANDINGS_ROUTES),
    },
    {
        path: 'forum',
        loadChildren: () => import('./pages/forum/forum.routes').then(m => m.FORUM_ROUTES),
    },
    {
        path: 'votes',
        loadChildren: () => import('./pages/votes/votes.routes').then(m => m.VOTES_ROUTES),
    },
    {
        path: 'votes',
        loadChildren: () => import('./pages/votes/votes.routes').then(m => m.VOTES_ROUTES),
    },
    {
        path: 'profile',
        loadChildren: () => import('./pages/profile/profile.routes').then(m => m.PROFILE_ROUTES),
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES),
    },
];