import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIcon],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  itemName: string = "";

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data) {
      const { itemName } = data;
      this.itemName = itemName as string;
    }
  }

  triggerCancel() {
    this.dialogRef.close(false);
    this.cancel.emit();
  }

  triggerSave() {
    this.dialogRef.close(true);
    this.save.emit();
  }
}
