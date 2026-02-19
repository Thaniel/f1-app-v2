import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { COLORS } from '../../constants/colors';

type Action = 0 | 1 | 2;
type AuthAction = 0 | 1 | 2;
type Gender = 'm' | 'f';

const CONTEXTS: Record<string, { label: string; gender: Gender }> = {
  notice: { label: $localize`:@@ctxNotice:Notice`, gender: 'f' },
  comment: { label: $localize`:@@ctxComment:Comment`, gender: 'm' },
  race: { label: $localize`:@@ctxRace:Race`, gender: 'f' },
  team: { label: $localize`:@@ctxTeam:Team`, gender: 'f' },
  driver: { label: $localize`:@@ctxDriver:Driver`, gender: 'm' },
  topic: { label: $localize`:@@ctxTopic:Topic`, gender: 'm' },
  user: { label: $localize`:@@ctxUser:User`, gender: 'm' },
  qualifiying: { label: $localize`:@@ctxQualifiying:Qualifiying`, gender: 'f' },
};

const ACTIONS_OK: Record<Action, { m: string; f: string }> = {
  0: {
    m: $localize`:@@created_m:created`,
    f: $localize`:@@created_f:created`,
  },
  1: {
    m: $localize`:@@edited_m:edited`,
    f: $localize`:@@edited_f:edited`,
  },
  2: {
    m: $localize`:@@deleted_m:deleted`,
    f: $localize`:@@deleted_f:deleted`,
  },
};

const ACTIONS_KO: Record<Action, string> = {
  0: $localize`:@@creating_m:creating`,
  1: $localize`:@@editing_m:editing`,
  2: $localize`:@@deleting_m:deleting`,
};

const AUTH_MESSAGES: Record<AuthAction, { ok: string; ko: string }> = {
  0: {
    ok: $localize`:@@authLoginSuccess:Login successful`,
    ko: $localize`:@@authLoginError:Login failed`,
  },
  1: {
    ok: $localize`:@@authRegisterSuccess:Registration successful`,
    ko: $localize`:@@authRegisterError:Registration failed`,
  },
  2: {
    ok: $localize`:@@authRecoverySuccess:Recovery email sent successfully`,
    ko: $localize`:@@authRecoveryError:Error sending recovery email`,
  },
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

    if (context === 'auth') {
      this.text = this.getAuthMessage(action, isOk);
    } else {
      this.text = isOk ? this.getSuccessMessage(context, action) : this.getErrorMessage(context, action);
    }
    this.icon = isOk ? 'check' : 'report_outlined';
    this.backgroundColor = isOk ? COLORS.secondary : COLORS.primaryDark;
  }

  private getSuccessMessage(contextKey: string, action: Action): string {
    const context = CONTEXTS[contextKey];
    if (!context) return '';

    const actionLabel = ACTIONS_OK[action][context.gender];

    return $localize`:@@successDynamic:${context.label} ${actionLabel}`;
  }

  private getErrorMessage(contextKey: string, action: Action): string {
    const context = CONTEXTS[contextKey];
    if (!context) return '';

    const actionLabel = ACTIONS_KO[action];

    return $localize`:@@errorDynamic:Error while ${actionLabel} ${context.label}`;
  }

  private getAuthMessage(action: AuthAction, isOk: boolean): string {
    const messageSet = AUTH_MESSAGES[action];
    if (!messageSet) return '';

    return isOk ? messageSet.ok : messageSet.ko;
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
