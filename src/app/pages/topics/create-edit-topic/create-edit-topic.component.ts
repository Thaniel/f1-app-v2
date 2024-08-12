import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ITopic } from '../../../core/interfaces/topic.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { TopicsService } from '../../../core/services/topics/topics.service';
import { CancelSaveButtonsComponent } from '../../../shared/components/cancel-save-buttons/cancel-save-buttons.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { ValidatorsService } from '../../../shared/services/validators.service';

@Component({
  selector: 'app-create-edit-topic',
  standalone: true,
  imports: [MatDialogModule, CancelSaveButtonsComponent, MatInputModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-edit-topic.component.html',
  styleUrl: './create-edit-topic.component.css'
})
export class CreateEditTopicComponent {
  isCreating: boolean = true;
  titleAction: string = "Create";

  public topicForm: FormGroup = this.fb.group({
    id: [],
    title: ['', [Validators.required]],
    date: [],
    comments: [],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ITopic,
    public dialogRef: MatDialogRef<CreateEditTopicComponent>,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private topicsService: TopicsService,
    private validatorsService: ValidatorsService,
    private authService: AuthService,
  ) {
    if (data) {
      this.topicForm.patchValue(data);
      this.isCreating = false;
    }
  }

  get currentTopic(): ITopic {
    return this.topicForm.value as ITopic;
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.topicForm, field);
  }

  onSubmit() {
    if (this.topicForm.invalid) {
      this.topicForm.markAllAsTouched();
    } else {

      if (this.isCreating) {
        this.createTopic();
      } else {
        this.updateTopic();
      }
      this.dialogRef.close();
    }
  }

  private async createTopic() {
    await this.authService.getCurrentUserInfo().then(user => {
      this.currentTopic.author = user;
    });

    this.topicsService.create(this.currentTopic).then(result => {
      this.showSnackBar(result, 0);
      this.topicsService.loadTopics();
    });
  }

  private async updateTopic() {
    const updatedData: Partial<ITopic> = {
      title: this.currentTopic.title,
    };

    this.topicsService.update(this.currentTopic.id, updatedData).then(result => {
      this.showSnackBar(result, 1);
      this.topicsService.loadTopics();
    });
  }

  save(): void {
    this.onSubmit();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private showSnackBar(isOk: boolean, action: number): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: TIME_OUT,
      data: { isOk: isOk, action: action, context: 'topic' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    });
  }
}