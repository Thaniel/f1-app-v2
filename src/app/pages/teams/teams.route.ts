import { Routes } from '@angular/router';
import { TeamsPageComponent } from './teams-page/teams-page.component';
import { TeamDetailsComponent } from './team-details/team-details.component';

export const TEAMS_ROUTES: Routes = [
    {
        path: '',
        component: TeamsPageComponent,
    },
    {
        path: ':id',
        component: TeamDetailsComponent,
    }
];
