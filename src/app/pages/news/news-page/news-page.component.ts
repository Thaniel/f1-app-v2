import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { filter, take } from 'rxjs';
import { INew } from '../../../core/interfaces/new.interface';
import { IUser } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NewsService } from '../../../core/services/news/news.service';
import { sort } from '../../../core/utils';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EditMenuComponent } from '../../../shared/components/edit-menu/edit-menu.component';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { HeaderButtonsComponent } from '../../../shared/components/header-buttons/header-buttons.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { CreateEditNewComponent } from '../create-edit-new/create-edit-new.component';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent, HeaderButtonsComponent, CommonModule, RouterLink, EditMenuComponent, MatPaginator, FilterComponent],
  templateUrl: './news-page.component.html',
  styleUrl: './news-page.component.css'
})
export class NewsPageComponent implements OnInit {
  news: INew[] = [];
  public currentUser: IUser | null = null;

  pagedNews: INew[] = [];
  pageSize: number = 4;
  currentPage: number = 0;

  private destroyRef = inject(DestroyRef);

  constructor(
    private readonly snackBar: MatSnackBar,
    public dialog: MatDialog,
    private readonly newsService: NewsService,
    private readonly authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getNews();

    this.newsService.reload$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.getNews());
  }

  async getNews() {
    this.news = await this.newsService.getAll();
    this.getPagedNews();
  }

  private async getCurrentUser() {
    await this.authService.getCurrentUserInfo().then(user => {
      this.currentUser = user;
    });
  }

  editNew(notice: INew): void {
    this.dialog.open(CreateEditNewComponent, {
      data: notice,
      width: '90vw',
    });
  }

  openConfirmDialog(notice: INew): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { itemName: notice.title }
    });

    dialogRef.afterClosed()
      .pipe(filter(Boolean), take(1))
      .subscribe(() => this.deleteNew(notice));
  }

  private async deleteNew(notice: INew) {
    const result = await this.newsService.delete(notice.id);
    this.showSnackBar(result);
  }

  public isCurrentUserAuthor(notice: INew): boolean {
    return notice.author?.id === this.currentUser?.id;
  }

  private showSnackBar(isOk: boolean): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { isOk: isOk, action: 2, context: 'notice' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    });
  }

  getPagedNews(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedNews = this.news.slice(start, end);
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPagedNews();
  }

  sortChanged(option: string): void {
    this.news = sort(this.news, option);
    this.getPagedNews()
  }
}
