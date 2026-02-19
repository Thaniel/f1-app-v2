import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { IRace } from '../../../core/interfaces/race.interface';
import { RacesService } from '../../../core/services/races/races.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EditMenuComponent } from '../../../shared/components/edit-menu/edit-menu.component';
import { HeaderButtonsComponent } from '../../../shared/components/header-buttons/header-buttons.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { CreateEditRaceComponent } from '../create-edit-race/create-edit-race.component';

@Component({
  selector: 'app-races-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent, HeaderButtonsComponent, CommonModule, RouterLink, EditMenuComponent],
  templateUrl: './races-page.component.html',
  styleUrl: './races-page.component.css'
})
export class RacesPageComponent implements OnInit {
  races: IRace[] = [];
  nextRace: IRace | null = null; 

  constructor(
    private readonly snackBar: MatSnackBar,
    public dialog: MatDialog,
    private readonly racesService: RacesService,
  ) { }

  ngOnInit(): void {
    this.getRaces();

    this.racesService.reload$.subscribe(() => {
      this.getRaces();
    });
  }

  async getRaces() {
    this.races = await this.racesService.getAll();
    this.setNextRace();
  }

  private setNextRace() {
    const currentDate = new Date();
    
    this.nextRace = this.races
      .filter(race => new Date(race.date) > currentDate)[0] || null;
  }

  editRace(race: IRace): void {
    this.dialog.open(CreateEditRaceComponent, {
      data: race,
      width: '90vw',
    });
  }

  openConfirmDialog(race: IRace): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { itemName: race.country + " GP" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteRace(race);
      }
    });
  }

  private async deleteRace(race: IRace) {
    const result = await this.racesService.delete(race.id);
    this.showSnackBar(result);
    this.racesService.loadRaces();
  }

  private showSnackBar(isOk: boolean): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { isOk: isOk, action: 2, context: 'race' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    });
  }
}
