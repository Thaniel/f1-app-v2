import { Routes } from '@angular/router';
import { VotesPageComponent } from './votes-page/votes-page.component';

export const VOTES_ROUTES: Routes = [
    {
        path: '',
        component: VotesPageComponent,
    },
];