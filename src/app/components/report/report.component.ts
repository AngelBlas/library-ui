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
import { BookingResponse } from '../../model/booking';
import { BookingService } from '../../services/booking.service';
import { BookStore } from '../../store/book.store';
import { BookingStore } from '../../store/booking.store';
import { ReportBooksComponent } from './report-books/report-books.component';

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
  selector: 'app-report',
  styleUrl: './report.component.css',
  templateUrl: './report.component.html',
  providers: [BookingStore],
})
export class ReportComponent {
  private readonly bookingService = inject(BookingService);
  private readonly bookResource = inject(BookingStore);
  private readonly dialog = inject(MatDialog);
  private readonly dataSource = new MatTableDataSource<BookingResponse>();

  protected readonly $paginator = viewChild(MatPaginator);
  protected readonly $sort = viewChild(MatSort);

  protected $booking = this.bookResource.$bookings;

  protected displayedColumns: string[] = ['index', 'customer', 'date', 'action'];

  constructor() {
    effect(() => {
      const data = this.$booking();
      const p = this.$paginator();
      const s = this.$sort();

      this.dataSource.data = data;
      this.dataSource.paginator = p;
      this.dataSource.sort = s;
    });
  }

  openDialog() {}

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogEdit(e: Array<string>) {
    console.log(JSON.stringify(e));
    const dialogRef = this.dialog.open(ReportBooksComponent, { data: { books: e } });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog resuilt: ${result}`);
    });
  }

  openDialogDelete(e: number) {}
}
