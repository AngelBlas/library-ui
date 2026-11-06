import { Component, computed, effect, inject } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import { BookForm } from '../../../forms/book.form';
import { Book } from '../../../model/book';
import { BookService } from '../../../services/book.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { BookEditStore } from '../../../store/book-edit.store';
import { CategoryStore } from '../../../store/category.store';

@Component({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormRoot,
    FormField,
    MatDialogModule,
    MatSlideToggleModule,
    MatSelectModule,
  ],
  selector: 'app-book-edit',
  styleUrl: './book-edit.component.css',
  templateUrl: './book-edit.component.html',
  providers: [BookForm, BookEditStore, CategoryStore],
})
export class BookEditComponent {
  private readonly bookService = inject(BookService);
    private readonly categoryStore = inject(CategoryStore)
  private readonly notificationService = inject(NotificationService)
  private readonly dialogRef = inject(MatDialogRef<BookEditComponent>);

  protected $categories = this.categoryStore.$categories;
  protected readonly bookForm = inject(BookForm);
  protected readonly bookEditStore = inject(BookEditStore);
  protected readonly $inputData = inject<{ bookId?: number } | null>(MAT_DIALOG_DATA, {
    optional: true,
  });

  public $id = computed(() => {
    const id = this.$inputData?.bookId;
    return id ? Number(id) : null;
  });
  
  public esEditar = computed(() => this.$id() !== null);

  constructor() {
    effect(() => {
      this.bookEditStore.setId(this.$id());
    });

    effect(() => {
      if (this.bookEditStore.bookResource.hasValue()) {
        this.bookForm.patch(this.bookEditStore.bookResource.value());
      }
    });
  }

  operate() {
    console.log('operate method in');
    if (this.bookForm.$isInvalid()) return;

    const isEdit = this.esEditar();
    const id = this.$id();
    const book: Book = this.bookForm.value();

    const operations = isEdit ? this.bookService.update(id, book) : this.bookService.save(book);

    operations.subscribe({
      next: () => {
        this.notificationService.notify(isEdit ? 'UPDATED':'CREATED')
        this.dialogRef.close('ok');
      },
      error: (err) => {
        console.log(err.status);
        console.log(err.error?.message);
      },
    });
  }
}
