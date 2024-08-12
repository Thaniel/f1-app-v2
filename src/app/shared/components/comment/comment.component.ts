import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IComment } from '../../../core/interfaces/new.interface';
import { IUser } from '../../../core/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommentsService } from '../../../core/services/comments/comments.service';
import { TIME_OUT } from '../../../shared/constants/constants';
import { CancelSaveButtonsComponent } from '../cancel-save-buttons/cancel-save-buttons.component';
import { EditMenuComponent } from '../edit-menu/edit-menu.component';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CancelSaveButtonsComponent, EditMenuComponent, CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {
  @Input() comment: IComment = { id: '0', author: null, text: '', date: new Date(), isEditing: false };
  @Input() newId: string = "";
  @Input() topicId: string = "";

  @Output() commentModified = new EventEmitter<void>();

  public currentUser: IUser | null = null;

  constructor(
    private commentsService: CommentsService,
    public snackBar: MatSnackBar,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  private async getCurrentUser() {
    await this.authService.getCurrentUserInfo().then(user => {
      this.currentUser = user;
    });
  }

  async save() {
    if (this.comment.id === "") {
      this.createComment();
    } else {
      this.updateComment();
    }

    this.comment.isEditing = false;
    this.commentModified.emit();
  }

  private async createComment() {
    this.comment.author = this.currentUser;
    
    let id = (this.newId == "")? this.topicId : this.newId;
    let collectionName = (this.newId == "")? "topics" : "news";

    this.commentsService.create(collectionName, id, this.comment).then(result => {
      this.showSnackBar(result, 0);
    });
  }

  private async updateComment() {
    const updatedData: Partial<IComment> = {
      text: this.comment.text,
    };

    let id = (this.newId == "")? this.topicId : this.newId;
    let collectionName = (this.newId == "")? "topics" : "news";

    this.commentsService.update(collectionName, id, this.comment.id, updatedData).then(result => {
      this.showSnackBar(result, 1);
    });
  }

  cancel(): void {
    this.comment.isEditing = false;
    this.commentModified.emit();
  }

  async delete() {
    let id = (this.newId == "")? this.topicId : this.newId;
    let collectionName = (this.newId == "")? "topics" : "news";

    const success = await this.commentsService.delete(collectionName, id, this.comment.id);
    this.showSnackBar(success, 2);
    this.commentModified.emit();
  }

  edit(): void {
    this.comment.isEditing = true;
  }

  public isCurrentUserAuthor(comment: IComment): boolean {
    return comment.author?.id === this.currentUser?.id;
  }

  private showSnackBar(isOk: boolean, action: number): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { isOk: isOk, action: action, context: 'comment' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    });
  }
}
