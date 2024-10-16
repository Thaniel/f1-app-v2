import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ITeam } from '../../../core/interfaces/team.interface';

@Component({
  selector: 'app-team-info-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIcon],
  templateUrl: './team-info-dialog.component.html',
  styleUrl: './team-info-dialog.component.css'
})
export class TeamInfoDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ITeam
  ) {}
}
