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
import { Customer } from '../../model/customer';
import { CustomerService } from '../../services/customer.service';
import { NotificationService } from '../../shared/services/notification.service';
import { CustomerStore } from '../../store/customer.store';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap, tap } from 'rxjs';

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
  selector: 'app-customer',
  styleUrl: './customer.component.css',
  templateUrl: './customer.component.html',
  providers: [CustomerStore, CustomerService],
})
export class CustomerComponent {
  private readonly customerService = inject(CustomerService);
  private readonly customerStore = inject(CustomerStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notifationService = inject(NotificationService);

  private readonly dataSource = new MatTableDataSource<Customer>();

  protected readonly $paginator = viewChild(MatPaginator);
  protected readonly $sort = viewChild(MatSort);

  protected $book = this.customerStore.$customers;
  protected displayedColumns: string[] = [
    'index',
    'firstName',
    'lastName',
    'cardId',
    'email',
    'action',
  ];

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
    const dialogRef = this.dialog.open(CustomerEditComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog resuilt: ${result}`);
      if (result === 'ok') {
        this.customerStore.reload();
      }
    });
  }

  openDialogEdit(customerId: number) {
    const dialogRef = this.dialog.open(CustomerEditComponent, {
      data: {
        customerId: customerId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog resuilt: ${result}`);
      if (result === 'ok') {
        this.customerStore.reload();
      }
    });
  }
  openDialogDelete(customerId: number) {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.customerService.delete(customerId)),
        tap(() => this.notifationService.notify('DELETED')),
      )
      .subscribe(() => {
        this.customerStore.reload();
      });
  }
}
