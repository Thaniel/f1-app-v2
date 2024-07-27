import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { IDriver } from '../../../core/interfaces/driver.interface';
import { DriversService } from '../../../core/services/drivers/drivers.service';
import { EditMenuComponent } from '../../../shared/components/edit-menu/edit-menu.component';
import { HeaderButtonsComponent } from '../../../shared/components/header-buttons/header-buttons.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { CreateEditDriverComponent } from '../create-edit-driver/create-edit-driver.component';
import { ITeam } from '../../../core/interfaces/team.interface';

@Component({
  selector: 'app-drivers-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent, HeaderButtonsComponent, CommonModule, RouterLink, EditMenuComponent],
  templateUrl: './drivers-page.component.html',
  styleUrl: './drivers-page.component.css'
})
export class DriversPageComponent implements OnInit {
  drivers: IDriver[] = [];

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private driversService: DriversService,
  ) { }

  ngOnInit(): void {
    this.getDrivers();

    this.driversService.reload$.subscribe(() => {
      this.getDrivers();
    });
  }
  
  async getDrivers() {
    this.drivers = await this.driversService.getAll();
  }

  editDriver(driver: IDriver): void {
    this.dialog.open(CreateEditDriverComponent, {
      data: driver,
      width: '90vw',
    });
  }

  async deleteDriver(driver: IDriver) {
    const success = await this.driversService.delete(driver.id);
    this.showSnackBar(success);
    this.driversService.loadDrivers();
  }

  private showSnackBar(isOk: boolean): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { isOk: isOk, action: 2, context: 'driver' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    }); 
  }

  isTeam(obj: any): obj is ITeam {
    return obj && typeof obj.colorCode === 'string';
  }
}
