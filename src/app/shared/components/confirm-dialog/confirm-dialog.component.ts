import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Delete</h2>
    <mat-dialog-content>Are you sure you want to delete this record?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button type="button" (click)="onNoClick()">Cancel
        <mat-icon>Cancel</mat-icon>
      </button>
      <button class="cancel-button" matButton="outlined" type="button" [mat-dialog-close]="true" cdkFocusInitial>
        Delete
        <mat-icon>Delete</mat-icon>
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
