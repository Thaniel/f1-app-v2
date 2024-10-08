import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CreateEditDriverComponent } from '../../../pages/drivers/create-edit-driver/create-edit-driver.component';
import { CreateEditNewComponent } from '../../../pages/news/create-edit-new/create-edit-new.component';
import { CreateEditRaceComponent } from '../../../pages/races/create-edit-race/create-edit-race.component';
import { CreateEditTeamComponent } from '../../../pages/teams/create-edit-team/create-edit-team.component';
import { CreateEditTopicComponent } from '../../../pages/topics/create-edit-topic/create-edit-topic.component';

@Component({
  selector: 'app-header-buttons',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatGridListModule, MatIcon],
  templateUrl: './header-buttons.component.html',
  styleUrl: './header-buttons.component.css'
})
export class HeaderButtonsComponent implements OnInit {
  @Input() title: string = "title_default";

  permission: boolean = false;

  constructor(
    public dialog: MatDialog,
    private readonly authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.managePermission();
  }

  private managePermission(): void {
    if (this.title === "Topics") {
      this.permission = true;
    } else {
      this.authService.getCurrentUserInfo().then(user => {
        this.permission = user!.isAdmin;
      });
    }
  }

  showMy(): void {
    console.error("Show my elements");
  }

  openDialogCreate(): void {
    switch (this.title) {
      case 'News': this.openDialogNew(); break;
      case 'Races': this.openDialogRace(); break;
      case 'Teams': this.openDialogTeam(); break;
      case 'Drivers': this.openDialogDriver(); break;
      case 'Topics': this.openDialogTopic(); break;
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

  private openDialogTopic(): MatDialogRef<any, any> {
    return this.dialog.open(CreateEditTopicComponent, {
      data: null,
      width: '90vw',
    });
  }
}
