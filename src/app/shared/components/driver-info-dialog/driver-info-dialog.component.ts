import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { IDriver } from '../../../core/interfaces/driver.interface';

@Component({
  selector: 'app-driver-info-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIcon],
  templateUrl: './driver-info-dialog.component.html',
  styleUrl: './driver-info-dialog.component.css'
})
export class DriverInfoDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDriver
  ) {}
}
