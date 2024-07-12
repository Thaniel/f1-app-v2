import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule} from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-edit-menu',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatIcon],
  templateUrl: './edit-menu.component.html',
  styleUrl: './edit-menu.component.css'
})
export class EditMenuComponent {
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  triggerEdit() {
    this.edit.emit();
  }

  triggerDelete() {
    this.delete.emit();
  }
}
