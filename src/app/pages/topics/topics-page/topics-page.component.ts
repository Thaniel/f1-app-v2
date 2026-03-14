import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { filter, take } from 'rxjs';
import { ITopic } from '../../../core/interfaces/topic.interface';
import { IUser } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { TopicsService } from '../../../core/services/topics/topics.service';
import { sort } from '../../../core/utils';
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
  imports: [NavBarComponent, HeaderComponent, HeaderButtonsComponent, CommonModule, RouterLink, EditMenuComponent, MatPaginator, FilterComponent],
  templateUrl: './topics-page.component.html',
  styleUrl: './topics-page.component.css'
})
export class TopicsPageComponent implements OnInit {
  topics: ITopic[] = [];
  public currentUser: IUser | null = null;

  pagedTopics: ITopic[] = [];
  pageSize: number = 5;
  currentPage: number = 0;
  private destroyRef = inject(DestroyRef);

  constructor(
    private readonly snackBar: MatSnackBar,
    public dialog: MatDialog,
    private readonly topicsService: TopicsService,
    private readonly authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getTopics();

    this.topicsService.reload$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.getTopics());
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

    dialogRef.afterClosed()
      .pipe(filter(Boolean), take(1))
      .subscribe(() => this.deleteTopic(topic));
  }

  private async deleteTopic(topic: ITopic) {
    const result = await this.topicsService.delete(topic.id);
    this.showSnackBar(result);
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
    this.topics = sort(this.topics, option);
    this.getPagedTopics()
  }
}
