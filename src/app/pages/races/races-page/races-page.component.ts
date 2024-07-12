import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { IRace } from '../../../core/interfaces/race.interface';
import { RacesService } from '../../../core/services/races/races.service';
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
  imports: [NavBarComponent, HeaderComponent, HeaderButtonsComponent, SnackBarComponent, CommonModule, RouterLink, EditMenuComponent],
  templateUrl: './races-page.component.html',
  styleUrl: './races-page.component.css'
})
export class RacesPageComponent implements OnInit {
  races: IRace[] = [];
  permission: boolean = true;

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private racesService: RacesService,
  ) { }

  ngOnInit(): void {
    this.loadRaces();

    this.racesService.reload$.subscribe(() => {
      this.loadRaces();
    });
  }

  async loadRaces() {
    this.races = await this.racesService.getAll();
  }
  
  editRace(race: IRace): void {
    this.dialog.open(CreateEditRaceComponent, {
      data: race,
      width: '90vw',
    });
  }

  async deleteRace(race: IRace) {
    const success = await this.racesService.delete(race.id);
    this.showSnackBar(success);
    this.racesService.loadRaces();
  }

  private showSnackBar(isOk: boolean): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { text: (isOk) ? 'Race deleted!' : 'Error while deleting race!', isOk: isOk },
      panelClass: [(isOk) ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top'
    });
  }
}
