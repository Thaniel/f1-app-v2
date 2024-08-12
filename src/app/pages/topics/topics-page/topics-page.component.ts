import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { ITopic } from '../../../core/interfaces/topic.interface';
import { TopicsService } from '../../../core/services/topics/topics.service';
import { HeaderButtonsComponent } from '../../../shared/components/header-buttons/header-buttons.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { CreateEditTopicComponent } from '../create-edit-topic/create-edit-topic.component';

@Component({
  selector: 'app-topics-page',
  standalone: true,
  imports: [NavBarComponent, HeaderComponent, HeaderButtonsComponent, CommonModule, RouterLink],
  templateUrl: './topics-page.component.html',
  styleUrl: './topics-page.component.css'
})
export class TopicsPageComponent implements OnInit {
  topics: ITopic[] = [];
  
  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private topicsService: TopicsService,
  ) { }

  ngOnInit(): void {
    this.getTopics();

    this.topicsService.reload$.subscribe(() => {
      this.getTopics();
    });
  }

  async getTopics() {
    this.topics = await this.topicsService.getAll();
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

  private showSnackBar(isOk: boolean): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { isOk: isOk, action: 2, context: 'topic' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    });
  }
}
