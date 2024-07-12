import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { COLORS } from '../../constants/colors';

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [MatSnackBarModule, MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction, MatIconModule],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.css'
})
export class SnackBarComponent {
  text: string;
  icon: string;
  backgroundColor: string;

  constructor(
    public snackBarRef: MatSnackBarRef<SnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
    this.text = data.text;
    this.icon = (data.isOk) ? 'check' : 'report-outlined';
    this.backgroundColor = (data.isOk) ? COLORS.secondary : COLORS.primaryDark;
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
