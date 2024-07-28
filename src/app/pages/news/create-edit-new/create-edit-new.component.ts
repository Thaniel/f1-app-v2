import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INew } from '../../../core/interfaces/new.interface';
import { NewsService } from '../../../core/services/news/news.service';
import { CancelSaveButtonsComponent } from '../../../shared/components/cancel-save-buttons/cancel-save-buttons.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TIME_OUT } from '../../../shared/constants/constants';
import { ValidatorsService } from '../../../shared/services/validators.service';


@Component({
  selector: 'app-create-edit-new',
  standalone: true,
  imports: [MatDialogModule, MatInputModule, CommonModule, ReactiveFormsModule, CancelSaveButtonsComponent, SnackBarComponent, FileInputComponent],
  templateUrl: './create-edit-new.component.html',
  styleUrl: './create-edit-new.component.css'
})
export class CreateEditNewComponent {
  isCreating: boolean = true;
  titleAction: string = "Create";
  selectedFile: File | null = null;

  public newForm: FormGroup = this.fb.group({
    id: [],
    title: ['', [Validators.required]],
    date: [],
    summary: ['', [Validators.required]],
    text: ['', [Validators.required]],
    image: [],
    imageUrl: [],
    comments: [],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: INew,
    public dialogRef: MatDialogRef<CreateEditNewComponent>,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private newsService: NewsService,
    private validatorsService: ValidatorsService,
  ) {
    if (data) {
      this.newForm.patchValue(data);
      this.isCreating = false;
      if (data.image) {
        this.selectedFile = data.image;
      }
    }
  }

  get currentNew(): INew {
    return this.newForm.value as INew;
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.newForm, field);
  }
  
  onFileSelected(file: File) {
    this.selectedFile = file;
  }

  onSubmit() {
    if (this.newForm.invalid || this.selectedFile == null) {
      this.newForm.markAllAsTouched();
    } else {
      this.currentNew.image = this.selectedFile;

      if (this.isCreating) {
        this.createNew();
      } else {
        this.updateNew();
      }
      this.dialogRef.close();
    }
  }

  private async createNew() {
    this.newsService.create(this.currentNew).then(success => {
      this.showSnackBar(success, 0);
      this.newsService.loadNews();
    });
  }

  private async updateNew() {
    const updatedData: Partial<INew> = {
      title: this.currentNew.title,
      summary: this.currentNew.summary,
      text: this.currentNew.text,
    };

    this.newsService.update(this.currentNew.id, updatedData, this.selectedFile).then(success => {
      this.showSnackBar(success, 1);
      this.newsService.loadNews();
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
      data: { isOk: isOk, action: action, context: 'new' },
      panelClass: [isOk ? 'info-snackBar' : 'error-snackBar'],
      verticalPosition: 'top',
    });
  }
}