import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { COLORS } from '../../constants/colors';

interface Message {
  ok: string;
  ko: string;
}

type Action = 0 | 1 | 2;

type ContextMessages = {
  [key: string]: { [key in Action]: Message; }
};

const MESSAGES: ContextMessages = {
  new: {
    0: { ok: 'New created', ko: 'Error while creating new' },
    1: { ok: 'New edited', ko: 'Error while editing new' },
    2: { ok: 'New deleted', ko: 'Error while deleting new' }
  },
  comment: {
    0: { ok: 'Comment created', ko: 'Error while creating comment' },
    1: { ok: 'Comment edited', ko: 'Error while editing comment' },
    2: { ok: 'Comment deleted', ko: 'Error while deleting comment' }
  },
  race: {
    0: { ok: 'Race created', ko: 'Error while creating race' },
    1: { ok: 'Race edited', ko: 'Error while editing race' },
    2: { ok: 'Race deleted', ko: 'Error while deleting race' }
  },
  team: {
    0: { ok: 'Team created', ko: 'Error while creating team' },
    1: { ok: 'Team edited', ko: 'Error while editing team' },
    2: { ok: 'Team deleted', ko: 'Error while deleting team' }
  },
  driver: {
    0: { ok: 'Driver created', ko: 'Error while creating driver' },
    1: { ok: 'Driver edited', ko: 'Error while editing driver' },
    2: { ok: 'Driver deleted', ko: 'Error while deleting driver' }
  }
};

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [MatSnackBarModule, MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction, MatIconModule],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.css'
})
export class SnackBarComponent {
  text: string;
  icon: string;
  backgroundColor: string;

  constructor(
    public snackBarRef: MatSnackBarRef<SnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
    const { isOk, action, context } = data;
    const contextMessages = MESSAGES[context] || {};
    const messages = contextMessages[action as Action] || { ok: '', ko: '' };


    this.text = isOk ? messages.ok : messages.ko;
    this.icon = isOk ? 'check' : 'report_outlined';
    this.backgroundColor = isOk ? COLORS.secondary : COLORS.primaryDark;
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
