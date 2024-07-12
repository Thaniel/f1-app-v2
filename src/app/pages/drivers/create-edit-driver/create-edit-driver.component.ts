import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { IDriver } from '../../../core/interfaces/driver.interface';
import { CancelSaveButtonsComponent } from '../../../shared/components/cancel-save-buttons/cancel-save-buttons.component';

@Component({
  selector: 'app-create-edit-driver',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatInputModule, CancelSaveButtonsComponent],
  templateUrl: './create-edit-driver.component.html',
  styleUrl: './create-edit-driver.component.css'
})
export class CreateEditDriverComponent {

  isCreating: boolean = true;
  titleAction: string = "Create";

  public driverForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    country: ['', [Validators.required]],
    points: ['', [Validators.required]],
    titles: ['', [Validators.required]],
    team: ['', [Validators.required]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDriver,
    public dialogRef: MatDialogRef<CreateEditDriverComponent>,
    private fb: FormBuilder,
  ) {
    if (data) {
      this.driverForm.patchValue(data);
      this.isCreating = false;
    }
  }

  get driver(): IDriver {
    return this.driverForm.value as IDriver;
  }

  isValidField(field: string): boolean | null {
    return this.driverForm.controls[field].errors && this.driverForm.controls[field].touched;
  }

  onSubmit(): void {
    if (this.driverForm.invalid) {
      this.driverForm.markAllAsTouched();
    } else {
      if (this.isCreating) {
        console.error("Create driver: " + this.driver.id + " : " + this.driver.firstName);
      } else {
        console.error("Edit driver: " + this.driver.id + " : " + this.driver.firstName);
      }
      this.dialogRef.close();
    }
  }

  save(): void{
    this.onSubmit();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
