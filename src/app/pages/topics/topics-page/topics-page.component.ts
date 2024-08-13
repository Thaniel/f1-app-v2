import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { ITopic } from '../../../core/interfaces/topic.interface';
import { IUser } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { TopicsService } from '../../../core/services/topics/topics.service';
import { EditMenuComponent } from '../../../shared/components/edit-menu/edit-menu.component';
import { HeaderButtonsComponent } from '../../../shared/components/header-buttons/header-buttons.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { CreateEditTopicComponent } from '../create-edit-topic/create-edit-topic.component';

@Component({
  selector: 'app-topics-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent, HeaderButtonsComponent, CommonModule, RouterLink, EditMenuComponent],
  templateUrl: './topics-page.component.html',
  styleUrl: './topics-page.component.css'
})
export class TopicsPageComponent implements OnInit {
  topics: ITopic[] = [];
  public currentUser: IUser | null = null;
  
  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private topicsService: TopicsService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getTopics();

    this.topicsService.reload$.subscribe(() => {
      this.getTopics();
    });
  }

  async getTopics() {
    this.topics = await this.topicsService.getAll();
  }

  private async getCurrentUser() {
    await this.authService.getCurrentUserInfo().then(user => {
      this.currentUser = user;
    });
  }

  editTopic(topic: ITopic): void {
    this.dialog.open(CreateEditTopicComponent, {
      data: topic,
      width: '90vw',
    });
  }

  async deleteTopic(topic: ITopic) {
    const result = await this.topicsService.delete(topic.id);
    this.showSnackBar(result);
    this.topicsService.loadTopics();
  }

  public isCurrentUserAuthor(topic: ITopic): boolean {
    return topic.author?.id === this.currentUser?.id;
  }

  private showSnackBar(isOk: boolean): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { isOk: isOk, action: 2, context: 'topic' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    });
  }
}
