import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { INew } from '../../../core/interfaces/new.interface';
import { NewsService } from '../../../core/services/news/news.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EditMenuComponent } from '../../../shared/components/edit-menu/edit-menu.component';
import { HeaderButtonsComponent } from '../../../shared/components/header-buttons/header-buttons.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { CreateEditNewComponent } from '../create-edit-new/create-edit-new.component';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent, HeaderButtonsComponent, SnackBarComponent, CommonModule, RouterLink, EditMenuComponent, ConfirmDialogComponent],
  templateUrl: './news-page.component.html',
  styleUrl: './news-page.component.css'
})
export class NewsPageComponent implements OnInit {
  news: INew[] = [];
  
  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private newsService: NewsService,
  ) { }

  ngOnInit(): void {
    this.getNews();

    this.newsService.reload$.subscribe(() => {
      this.getNews();
    });
  }

  async getNews() {
    this.news = await this.newsService.getAll();
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteNew(notice);
      }
    });
  }

  private async deleteNew(notice: INew) {
    const result = await this.newsService.delete(notice.id);
    this.showSnackBar(result);
    this.newsService.loadNews();
  }

  private showSnackBar(isOk: boolean): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { isOk: isOk, action: 2, context: 'new' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    });
  }
}
