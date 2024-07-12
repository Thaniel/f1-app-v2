import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cancel-save-buttons',
  standalone: true,
  imports: [MatIcon, MatButtonModule],
  templateUrl: './cancel-save-buttons.component.html',
  styleUrl: './cancel-save-buttons.component.css'
})
export class CancelSaveButtonsComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  triggerCancel() {
    this.cancel.emit();
  }

  triggerSave() {
    this.save.emit();
  }
}
