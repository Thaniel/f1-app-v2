import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { ITeam } from '../../../core/interfaces/team.interface';
import { TeamsService } from '../../../core/services/teams/teams.service';
import { EditMenuComponent } from '../../../shared/components/edit-menu/edit-menu.component';
import { HeaderButtonsComponent } from '../../../shared/components/header-buttons/header-buttons.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { CreateEditTeamComponent } from '../create-edit-team/create-edit-team.component';

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
    this.getTeams();

    this.teamsService.reload$.subscribe(() => {
      this.getTeams();
    });
  }

  async getTeams() {
    this.teams = await this.teamsService.getAll();
  }

  editTeam(team: ITeam): void {
    this.dialog.open(CreateEditTeamComponent, {
      data: team,
      width: '90vw',
    });
  }

  async deleteTeam(team: ITeam) {
    const result = await this.teamsService.delete(team.id);
    this.showSnackBar(result);
    this.teamsService.loadTeams();
  }

  private showSnackBar(isOk: boolean): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { isOk: isOk, action: 2, context: 'team' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    });
  }
}
