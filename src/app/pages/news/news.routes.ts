import { Routes } from '@angular/router';
import { NewsPageComponent } from './news-page/news-page.component';
import { NewDetailsComponent } from './new-details/new-details.component';

export const NEWS_ROUTES: Routes = [
    {
        path: '',
        component: NewsPageComponent,
    },
    {
        path: ':id',
        component: NewDetailsComponent,
    }
];
