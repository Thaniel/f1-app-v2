import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { ITeam } from '../../../core/interfaces/team.interface';
import { EditMenuComponent } from '../../../shared/components/edit-menu/edit-menu.component';
import { HeaderButtonsComponent } from '../../../shared/components/header-buttons/header-buttons.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { CreateEditTeamComponent } from '../create-edit-team/create-edit-team.component';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent, HeaderButtonsComponent, RouterLink, CommonModule, EditMenuComponent],
  templateUrl: './teams-page.component.html',
  styleUrl: './teams-page.component.css'
})
export class TeamsPageComponent {

  teams: ITeam[] = [
    {
      id: 1,
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
  ];

  constructor(
    public dialog: MatDialog,
  ) { }

  editTeam(team: ITeam): void {
    console.log("Edit team: " + team.id);

    this.dialog.open(CreateEditTeamComponent, {
      data: team,
      width: '90vw',
    });
  }

  deleteTeam(team: ITeam): void {
    console.log("Delete team: " + team.id);
    this.teams = this.teams.filter(t => t.id !== team.id);
  }
}
