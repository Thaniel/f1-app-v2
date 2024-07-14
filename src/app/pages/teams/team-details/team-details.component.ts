import { Component } from '@angular/core';
import { ITeam } from '../../../core/interfaces/team.interface';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-team-details',
  standalone: true,
  imports: [NavBarComponent],
  templateUrl: './team-details.component.html',
  styleUrl: './team-details.component.css'
})
export class TeamDetailsComponent {
  team: ITeam =
  {
    id: '1',
    name: "Mercedes",
    fullName: "Mercedes-AMG Petronas Formula One Team",
    teamPrincipal: "Toto Wolff",
    titles: 7,
    points: 1000,
    colorCode: "#00D2BE",
    driver1: null,
    driver2: null,
    description: "One of the most successful teams in Formula 1 history.",
    carImage: null,
    carImageUrl: "",
    logoImage: null,
    logoImageUrl: "",
  }
}
