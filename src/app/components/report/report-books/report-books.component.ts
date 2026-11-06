import { Component, effect, inject, Signal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IndexKind } from 'typescript';

@Component({
  imports: [MatDialogModule, MatIconModule, MatButtonModule],
  selector: 'app-report-books',
  styleUrl: './report-books.component.css',
  templateUrl: './report-books.component.html',
})
export class ReportBooksComponent {
  private readonly data = inject<ReportBooksComponent>(MAT_DIALOG_DATA)
  private readonly dialogRef = inject(MatDialogRef<ReportBooksComponent>);

  private readonly $inputData = inject<{books : string[]}>(MAT_DIALOG_DATA)

  private books=signal<string []>(this.$inputData.books)

  // constructor(){
  //   effect(()=>{
  //     this.books = this.$inputData.books
  //   })
  // }

}
