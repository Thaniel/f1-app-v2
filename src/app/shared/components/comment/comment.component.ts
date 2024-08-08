import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IComment } from '../../../core/interfaces/new.interface';
import { CancelSaveButtonsComponent } from '../cancel-save-buttons/cancel-save-buttons.component';
import { EditMenuComponent } from '../edit-menu/edit-menu.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../../core/services/comments/comments.service';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TIME_OUT } from '../../../shared/constants/constants';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CancelSaveButtonsComponent, EditMenuComponent, CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() comment: IComment = { id: '0', author: null, text: '', date: new Date(), isEditing: false };
  @Input() newId: string = "";

  @Output() commentModified = new EventEmitter<void>();

  constructor(
    private commentsService: CommentsService,
    public snackBar: MatSnackBar,
    private authService: AuthService,
  ) { }

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
    await this.authService.getCurrentUserInfo().then(user => {
      this.comment.author = user;
    });

    this.commentsService.create(this.newId, this.comment).then(result => {
      this.showSnackBar(result, 0);
    });
  }

  private async updateComment() {
    const updatedData: Partial<IComment> = {
      text: this.comment.text,
    };

    this.commentsService.update(this.newId, this.comment.id, updatedData).then(result => {
      this.showSnackBar(result, 1);
    });
  }


  cancel(): void {
    this.comment.isEditing = false;
    this.commentModified.emit();
  }

  async delete() {
    const success = await this.commentsService.delete(this.newId, this.comment.id);
    this.showSnackBar(success, 2);
    this.commentModified.emit();
  }

  edit(): void {
    this.comment.isEditing = true;
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
