import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrl: './notification-dialog.component.css'
})
export class NotificationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private readonly dialogRef: MatDialogRef<NotificationDialogComponent> // Inject MatDialogRef
  ) {
  }

  // Method to close the dialog
  close() {
    this.dialogRef.close(); // Close the dialog
  }
}
