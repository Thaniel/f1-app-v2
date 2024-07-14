import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { INew } from '../../../core/interfaces/new.interface';
import { NewsService } from '../../../core/services/news/news.service';
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
  imports: [NavBarComponent, HeaderComponent, HeaderButtonsComponent, SnackBarComponent, CommonModule, RouterLink, EditMenuComponent],
  templateUrl: './news-page.component.html',
  styleUrl: './news-page.component.css'
})
export class NewsPageComponent implements OnInit {
  news: INew[] = [];
  permission: boolean = true;
  
  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private newsService: NewsService,
  ) { }

  ngOnInit(): void {
    this.loadNews();

    this.newsService.reload$.subscribe(() => {
      this.loadNews();
    });
  }

  async loadNews() {
    this.news = await this.newsService.getAll();
  }

  editNew(notice: INew): void {
    this.dialog.open(CreateEditNewComponent, {
      data: notice,
      width: '90vw',
    });
  }

  async deleteNew(notice: INew) {
    const success = await this.newsService.delete(notice.id);
    this.showSnackBar(success);
    this.newsService.loadNews();
  }


  private showSnackBar(isOk: boolean): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { text: (isOk) ? 'New deleted!' : 'Error while deleting new!', isOk: isOk },
      panelClass: [(isOk) ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top'
    });
  }
}