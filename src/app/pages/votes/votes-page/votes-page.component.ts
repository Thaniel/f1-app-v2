import { Component } from '@angular/core';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-votes-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent],
  templateUrl: './votes-page.component.html',
  styleUrl: './votes-page.component.css'
})
export class VotesPageComponent {

}
