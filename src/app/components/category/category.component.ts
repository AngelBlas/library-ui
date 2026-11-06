import { Component, effect, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Category } from '../../model/category';
import { CategoryStore } from '../../store/category.store';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap, tap } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../shared/services/notification.service';

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
  selector: 'app-category',
  styleUrl: './category.component.css',
  templateUrl: './category.component.html',
  providers: [CategoryStore],
})
export class CategoryComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly categoryStore = inject(CategoryStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);

  private readonly dataSource = new MatTableDataSource<Category>();

  protected readonly $paginator = viewChild(MatPaginator);
  protected readonly $sort = viewChild(MatSort);

  protected $categories = this.categoryStore.$categories;
  protected displayedColumns: string[] = ['index', 'name', 'description', 'action'];

  constructor() {
    effect(() => {
      const data = this.$categories();
      const p = this.$paginator();
      const s = this.$sort();

      this.dataSource.data = data;
      this.dataSource.paginator = p;
      this.dataSource.sort = s;
    });
    effect(() => {
      const message = this.notificationService.$message();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
        this.notificationService.clear();
      }
    });
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog() {
    const dialogRef = this.dialog.open(CategoryEditComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if(result === 'ok'){
        this.categoryStore.reload();
      }
    });
  }

  openDialogEdit(categoryId: number) {
    const dialogRef = this.dialog.open(CategoryEditComponent, {
      data: {
        categoryId: categoryId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result === 'ok'){
        this.categoryStore.reload();
      }
    });
  }

  openDialogDelete(categoryId: number) {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.categoryService.delete(categoryId)),
        tap(() => this.notificationService.notify('DELETED')),
      )
      .subscribe(() => {
        this.categoryStore.reload();
      });
  }
}
