import { Component, effect, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter, switchMap, tap } from 'rxjs';
import { Book } from '../../model/book';
import { BookService } from '../../services/book.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../shared/services/notification.service';
import { BookStore } from '../../store/book.store';
import { BookEditComponent } from './book-edit/book-edit.component';
import { CategoryStore } from '../../store/category.store';

@Component({
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  selector: 'app-book',
  styleUrl: './book.component.css',
  templateUrl: './book.component.html',
  providers: [BookStore],
})
export class BookComponent {
  private readonly bookService = inject(BookService);
  private readonly bookResource = inject(BookStore);

  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notifationService = inject(NotificationService);

  private readonly dataSource = new MatTableDataSource<Book>();

  protected readonly $paginator = viewChild(MatPaginator);
  protected readonly $sort = viewChild(MatSort);

  protected $book = this.bookResource.$books;

  protected displayedColumns: string[] = ['index', 'title', 'author', 'action'];

  constructor() {
    effect(() => {
      const data = this.$book();
      const p = this.$paginator();
      const s = this.$sort();

      this.dataSource.data = data;
      this.dataSource.paginator = p;
      this.dataSource.sort = s;
    });

    effect(() => {
      const message = this.notifationService.$message();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
        this.notifationService.clear();
      }
    });
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog() {
    const dialogRef = this.dialog.open(BookEditComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog resuilt: ${result}`);
      if (result === 'ok') {
        this.bookResource.reload();
      }
    });
  }

  openDialogEdit(bookId: number) {
    const dialogRef = this.dialog.open(BookEditComponent, {
      data: {
        bookId: bookId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog resuilt: ${result}`);
      if (result === 'ok') {
        this.bookResource.reload();
      }
    });
  }

  openDialogDelete(bookId: number) {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.bookService.delete(bookId)),
        tap(() => this.notifationService.notify('DELETED')),
      )
      .subscribe(() => {
        this.bookResource.reload();
      });
  }
}
