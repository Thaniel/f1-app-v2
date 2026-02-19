import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IDriver } from '../../../core/interfaces/driver.interface';
import { ITeam } from '../../../core/interfaces/team.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { DriversService } from '../../../core/services/drivers/drivers.service';
import { TeamsService } from '../../../core/services/teams/teams.service';
import { CancelSaveButtonsComponent } from '../../../shared/components/cancel-save-buttons/cancel-save-buttons.component';
import { DriverInfoDialogComponent } from '../../../shared/components/driver-info-dialog/driver-info-dialog.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TeamInfoDialogComponent } from '../../../shared/components/team-info-dialog/team-info-dialog.component';
import { TIME_OUT } from '../../../shared/constants/constants';

@Component({
  selector: 'app-standings-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent, CommonModule, MatIcon, MatButtonModule, CancelSaveButtonsComponent, FormsModule],
  templateUrl: './standings-page.component.html',
  styleUrl: './standings-page.component.css'
})
export class StandingsPageComponent implements OnInit {
  permission: boolean = false;
  isDriversSelected: boolean = true;
  isEditingPoints: boolean = false;

  drivers: IDriver[] = [];
  teams: ITeam[] = [];
  oldDrivers: IDriver[] = [];
  oldTeams: ITeam[] = [];

  constructor(
    private readonly teamsService: TeamsService,
    private readonly driversService: DriversService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getCurrentUserPermission();
    this.getTeams();
    this.getDrivers();

    this.teamsService.reload$.subscribe(() => {
      this.getTeams();
    });

    this.driversService.reload$.subscribe(() => {
      this.getDrivers();
    });
  }

  async getCurrentUserPermission() {
    this.authService.getCurrentUserInfo().then(user => {
      this.permission = user!.isAdmin;
    });
  }

  async getTeams() {
    this.teams = await this.teamsService.getAll();
  }

  async getDrivers() {
    this.drivers = await this.driversService.getAll();
  }

  onSelectionChange(event: any) {
    this.isDriversSelected = (event.target.id === "btnDrivers");
  }

  isTeam(obj: any): obj is ITeam {
    return obj && typeof obj.colorCode === 'string';
  }

  showEditFields() {
    this.isEditingPoints = true;
    this.oldDrivers = this.drivers.map(driver => ({ ...driver }));
    this.oldTeams = this.teams.map(team => ({ ...team }));
  }

  save() {
    const driverUpdates = this.drivers.map(driver => this.updateDriver(driver));
    const teamUpdates = this.teams.map(team => this.updateTeam(team));

    Promise.all([...driverUpdates, ...teamUpdates]).then(results => {
      const allOk = results.every(result => result === true);
      this.showSnackBar(allOk);
    });

    this.teamsService.loadTeams();
    this.driversService.loadDrivers();
    this.isEditingPoints = false;
  }

  cancel() {
    this.isEditingPoints = false;
    this.drivers = this.oldDrivers.map(driver => ({ ...driver }));
    this.teams = this.oldTeams.map(team => ({ ...team }));
  }

  private async updateDriver(driver: IDriver): Promise<boolean> {
    const updatedData: Partial<IDriver> = {
      points: driver.points,
    };

    return this.driversService.update(driver.id, updatedData, null).then(result => result);
  }

  private async updateTeam(team: ITeam): Promise<boolean> {
    const updatedData: Partial<ITeam> = {
      points: team.points,
    };

    return this.teamsService.update(team.id, updatedData, null, null).then(result => result);
  }


  onClickDriver(driver: IDriver): void {
    if (!this.isEditingPoints) {
      this.dialog.open(DriverInfoDialogComponent, {
        data: driver,
        width: '400px'
      });
    }
  }

  onClickTeam(team: ITeam): void {
    if (!this.isEditingPoints) {
      this.dialog.open(TeamInfoDialogComponent, {
        data: team,
        width: '400px'
      });
    }
  }

  private showSnackBar(isOk: boolean): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { isOk: isOk, action: 1, context: 'qualifiying' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    });
  }
}
