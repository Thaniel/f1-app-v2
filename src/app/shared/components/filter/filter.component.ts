import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [MatIcon, MatButtonModule, CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Output() sortChanged = new EventEmitter<string>();

  onSortChange(event: any) {   
    this.sortChanged.emit(event.target.value);
  }
}
