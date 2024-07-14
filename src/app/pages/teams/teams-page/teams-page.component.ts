import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { ITeam } from '../../../core/interfaces/team.interface';
import { EditMenuComponent } from '../../../shared/components/edit-menu/edit-menu.component';
import { HeaderButtonsComponent } from '../../../shared/components/header-buttons/header-buttons.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { CreateEditTeamComponent } from '../create-edit-team/create-edit-team.component';
import { TeamsService } from '../../../core/services/teams/teams.service';
import { TIME_OUT } from '../../../shared/constants/constants';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent, HeaderButtonsComponent, RouterLink, CommonModule, EditMenuComponent],
  templateUrl: './teams-page.component.html',
  styleUrl: './teams-page.component.css'
})
export class TeamsPageComponent implements OnInit {
  teams: ITeam[] = [];

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private teamsService: TeamsService,
  ) { }

  ngOnInit(): void {
    this.loadTeams();

    this.teamsService.reload$.subscribe(() => {
      this.loadTeams();
    });
  }
  async loadTeams() {
    this.teams = await this.teamsService.getAll();
  }

  editTeam(team: ITeam): void {
    this.dialog.open(CreateEditTeamComponent, {
      data: team,
      width: '90vw',
    });
  }

  async deleteTeam(team: ITeam) {
    const success = await this.teamsService.delete(team.id);
    this.showSnackBar(success);
    this.teamsService.loadTeams();
  }

  private showSnackBar(isOk: boolean): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { text: (isOk) ? 'Team deleted!' : 'Error while deleting team!', isOk: isOk },
      panelClass: [(isOk) ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top'
    });
  }
}
