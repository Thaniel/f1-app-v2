import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IComment } from '../../../core/interfaces/new.interface';
import { ITopic } from '../../../core/interfaces/topic.interface';
import { TopicsService } from '../../../core/services/topics/topics.service';
import { CommentComponent } from '../../../shared/components/comment/comment.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-topic-details',
  standalone: true,
  imports: [NavBarComponent, CommentComponent, CommonModule, MatButtonModule, RouterLink, MatIcon],
  templateUrl: './topic-details.component.html',
  styleUrl: './topic-details.component.css'
})
export class TopicDetailsComponent implements OnInit {

  topicSelected: ITopic = { id: '0', title: '', date: new Date(), author: null, comments: null };
  comments: IComment[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private topicsService: TopicsService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id');
      this.getTopicDetail(id);
    });    
  }

  private async getTopicDetail(id: string | null) {
    if (id != null) {
      let data = await this.topicsService.getById(id)

      if (data != null) {
        this.topicSelected = data;
        this.comments = data.comments!;
      } else {
        this.router.navigate(['/topics']);
      }
    } else {
      this.router.navigate(['/topics']);
    }
  }

  commentModified() {
    this.getTopicDetail(this.topicSelected.id);
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
