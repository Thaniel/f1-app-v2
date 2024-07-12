import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { CreateEditDriverComponent } from '../../../pages/drivers/create-edit-driver/create-edit-driver.component';
import { CreateEditNewComponent } from '../../../pages/news/create-edit-new/create-edit-new.component';
import { CreateEditRaceComponent } from '../../../pages/races/create-edit-race/create-edit-race.component';
import { CreateEditTeamComponent } from '../../../pages/teams/create-edit-team/create-edit-team.component';

@Component({
  selector: 'app-header-buttons',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatGridListModule],
  templateUrl: './header-buttons.component.html',
  styleUrl: './header-buttons.component.css'
})
export class HeaderButtonsComponent {
  @Input() title: string = "title_default";

  permission: boolean = true;

  constructor(public dialog: MatDialog) { }

  showMy(): void {
    console.error("Show my elements");
  }

  openDialogCreate(): void {
    switch (this.title) {
      case 'News': this.openDialogNew(); break;
      case 'Races': this.openDialogRace(); break;
      case 'Teams': this.openDialogTeam(); break;
      case 'Drivers': this.openDialogDriver(); break;
      default:
        console.error('Invalid component name');
        return;
    }
  }

  private openDialogNew(): MatDialogRef<any, any> {
    return this.dialog.open(CreateEditNewComponent, {
      data: null,
      width: '90vw',
    });
  }

  private openDialogRace(): MatDialogRef<any, any> {
    return this.dialog.open(CreateEditRaceComponent, {
      data: null,
      width: '90vw',
    });
  }

  private openDialogTeam(): MatDialogRef<any, any> {
    return this.dialog.open(CreateEditTeamComponent, {
      data: null,
      width: '90vw',
    });
  }

  private openDialogDriver(): MatDialogRef<any, any> {
    return this.dialog.open(CreateEditDriverComponent, {
      data: null,
      width: '90vw',
    });
  }
}
