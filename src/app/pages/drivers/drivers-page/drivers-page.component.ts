import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { IDriver } from '../../../core/interfaces/driver.interface';
import { ITeam } from '../../../core/interfaces/team.interface';
import { DriversService } from '../../../core/services/drivers/drivers.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EditMenuComponent } from '../../../shared/components/edit-menu/edit-menu.component';
import { HeaderButtonsComponent } from '../../../shared/components/header-buttons/header-buttons.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { CreateEditDriverComponent } from '../create-edit-driver/create-edit-driver.component';

@Component({
  selector: 'app-drivers-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent, HeaderButtonsComponent, CommonModule, RouterLink, EditMenuComponent, ConfirmDialogComponent],
  templateUrl: './drivers-page.component.html',
  styleUrl: './drivers-page.component.css'
})
export class DriversPageComponent implements OnInit {
  drivers: IDriver[] = [];

  constructor(
    private readonly snackBar: MatSnackBar,
    public dialog: MatDialog,
    private readonly driversService: DriversService,
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

  openConfirmDialog(driver: IDriver): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { itemName: driver.firstName + " " + driver.lastName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteDriver(driver);
      }
    });
  }

  private async deleteDriver(driver: IDriver) {
    const result = await this.driversService.delete(driver.id);
    this.showSnackBar(result);
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
