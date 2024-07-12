import { Routes } from '@angular/router';
import { RacesPageComponent } from './races-page/races-page.component';
import { RaceDetailsComponent } from './race-details/race-details.component';

export const RACES_ROUTES: Routes = [
    {
        path: '',
        component: RacesPageComponent,
    },
    {
        path: ':id',
        component: RaceDetailsComponent,
    }
];
