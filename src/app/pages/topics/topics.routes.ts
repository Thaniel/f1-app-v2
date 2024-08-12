import { Routes } from '@angular/router';
import { TopicDetailsComponent } from './topic-details/topic-details.component';
import { TopicsPageComponent } from './topics-page/topics-page.component';

export const TOPICS_ROUTES: Routes = [
    {
        path: '',
        component: TopicsPageComponent,
    },
    {
        path: ':id',
        component: TopicDetailsComponent,
    }

];