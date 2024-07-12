import { Routes } from '@angular/router';
import { DriversPageComponent } from './drivers-page/drivers-page.component';
import { DriverDetailsComponent } from './driver-details/driver-details.component';

export const DRIVERS_ROUTES: Routes = [
    {
        path: '',
        component: DriversPageComponent,
    },
    {
        path: ':id',
        component: DriverDetailsComponent,
    }

];
