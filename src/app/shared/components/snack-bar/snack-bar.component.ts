import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
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
  },
  auth: {
    0: { ok: 'Login successful', ko: 'Login failed' },
    1: { ok: 'Registration successful', ko: 'Registration failed' },
    2: { ok: 'Recovery email sent successfully', ko: 'Error sending recovery email' },
  },
  topic: {
    0: { ok: 'Topic created', ko: 'Error while creating topic' },
    1: { ok: 'Topic edited', ko: 'Error while editing topic' },
    2: { ok: 'Topic deleted', ko: 'Error while deleting topic' }
  },
  user: {
    0: { ok: 'User data edited', ko: 'Error while editing user data' },
    1: { ok: 'User email edited', ko: 'Error while editing user email' },
    2: { ok: 'User password edited', ko: 'Error while editing user password' }
  },
  teams_drivers: {
    0: { ok: '', ko: '' },  /* Not used */
    1: { ok: 'Teams and drivers edited', ko: 'Error while editing teams and drivers' },
    2: { ok: '', ko: '' }   /* Not used */
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
