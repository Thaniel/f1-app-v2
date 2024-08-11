import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IDriver } from '../../../core/interfaces/driver.interface';
import { ITeam } from '../../../core/interfaces/team.interface';
import { TeamsService } from '../../../core/services/teams/teams.service';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';


@Component({
  selector: 'app-team-details',
  standalone: true,
  imports: [NavBarComponent, CommonModule, RouterLink],
  templateUrl: './team-details.component.html',
  styleUrl: './team-details.component.css'
})
export class TeamDetailsComponent implements OnInit {

  teamSelected: ITeam = {
    id: '0',
    name: '',
    fullName: '',
    teamPrincipal: '',
    titles: 0,
    points: 0,
    colorCode: '',
    driver1: null,
    driver2: null,
    description: '',
    carImage: null,
    carImageUrl: '',
    logoImage: null,
    logoImageUrl: '',
  };

  driver1: IDriver | null = null;
  driver2: IDriver | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private teamsService: TeamsService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id');
      this.getTeamDetail(id);
    });
  }

  private async getTeamDetail(id: string | null) {
    if (id != null) {
      let data = await this.teamsService.getById(id)

      if (data != null) {
        this.teamSelected = data;
        this.driver1 = this.teamSelected.driver1 as IDriver;
        this.driver2 = this.teamSelected.driver2 as IDriver;
      } else {
        this.router.navigate(['/teams']);
      }
    } else {
      this.router.navigate(['/teams']);
    }
  }
}
