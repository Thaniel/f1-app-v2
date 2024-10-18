import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { ITopic } from '../../../core/interfaces/topic.interface';
import { IUser } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { TopicsService } from '../../../core/services/topics/topics.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EditMenuComponent } from '../../../shared/components/edit-menu/edit-menu.component';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { HeaderButtonsComponent } from '../../../shared/components/header-buttons/header-buttons.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { CreateEditTopicComponent } from '../create-edit-topic/create-edit-topic.component';

@Component({
  selector: 'app-topics-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent, HeaderButtonsComponent, CommonModule, RouterLink, EditMenuComponent, ConfirmDialogComponent, MatPaginator, FilterComponent],
  templateUrl: './topics-page.component.html',
  styleUrl: './topics-page.component.css'
})
export class TopicsPageComponent implements OnInit {
  topics: ITopic[] = [];
  public currentUser: IUser | null = null;

  pagedTopics: ITopic[] = [];
  pageSize: number = 5;
  currentPage: number = 0;

  constructor(
    private readonly snackBar: MatSnackBar,
    public dialog: MatDialog,
    private readonly topicsService: TopicsService,
    private readonly authService: AuthService,
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
    this.getPagedTopics();
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

  openConfirmDialog(topic: ITopic): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { itemName: topic.title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTopic(topic);
      }
    });
  }

  private async deleteTopic(topic: ITopic) {
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

  getPagedTopics(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedTopics = this.topics.slice(start, end);
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPagedTopics();
  }

  sortChanged(option: string): void {
    switch (option) {
      case 'newest':
        this.topics.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        break;
      case 'oldest':
        this.topics.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        break;
      case 'most-commented':
        this.topics.sort((a, b) => {
          const aCommentsLength = a.comments?.length ?? 0;
          const bCommentsLength = b.comments?.length ?? 0;
          return bCommentsLength - aCommentsLength;
        });
        break;
      default:
        console.log('Invalid sort option');
    }

    this.getPagedTopics()
  }
}
