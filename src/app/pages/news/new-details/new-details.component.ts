import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IComment } from '../../../core/interfaces/comment.interface';
import { INew } from '../../../core/interfaces/new.interface';
import { NewsService } from '../../../core/services/news/news.service';
import { CommentComponent } from '../../../shared/components/comment/comment.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-new-details',
  standalone: true,
  imports: [NavBarComponent, CommonModule, MatButtonModule, RouterLink, MatIcon, FormsModule, CommentComponent],
  templateUrl: './new-details.component.html',
  styleUrl: './new-details.component.css'
})
export class NewDetailsComponent implements OnInit {

  newSelected: INew = { id: '0', title: '', date: new Date(), summary: '', text: '', image: null, imageUrl: '', author: null, comments: null };
  comments: IComment[] = [];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly newsService: NewsService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id');
      this.getNewDetail(id);
    });
    
  }

  private async getNewDetail(id: string | null) {
    if (id != null) {
      let data = await this.newsService.getById(id)

      if (data != null) {
        this.newSelected = data;
        this.comments = data.comments!;
      } else {
        this.router.navigate(['/news']);
      }
    } else {
      this.router.navigate(['/news']);
    }
  }

  commentModified() {
    this.getNewDetail(this.newSelected.id);
  }

  cancel(comment: IComment): void {
    comment.isEditing = false;
    this.comments.pop();
  }

  createComment() {
    let comment: IComment = { id: "", author: null, text: '', date: new Date(), isEditing: true };
    this.comments.unshift(comment);
  }
}
