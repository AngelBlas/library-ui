import { Component, computed, effect, inject, Optional } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CategoryForm } from '../../../forms/category.form';
import { CategoryService } from '../../../services/category.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { CategoryEditStore } from '../../../store/category-edit.store';
import { Category } from '../../../model/category';

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
  ],
  selector: 'app-category-edit',
  styleUrl: './category-edit.component.css',
  templateUrl: './category-edit.component.html',
  providers: [CategoryForm, CategoryEditStore],
})
export class CategoryEditComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<CategoryEditComponent>);

  protected readonly categoryForm = inject(CategoryForm);
  protected readonly categoryEditStore = inject(CategoryEditStore);
  protected readonly $inputData = inject<{ categoryId?: number } | null>(MAT_DIALOG_DATA, {
    optional: true,
  });

  public $id = computed(() => {
    const id = this.$inputData?.categoryId;
    return id ? Number(id) : null;
  });

  public esEditar = computed(() => this.$id() !== null);

  constructor() {
    effect(() => {
      this.categoryEditStore.setId(this.$id());
    });

    effect(() => {
      if (this.categoryEditStore.bookResource.hasValue()) {
        this.categoryForm.patch(this.categoryEditStore.bookResource.value());
      }
    });
  }

  operate() {
    console.log('operate method in');
    if (this.categoryForm.$isInvalid()) return;

    const isEdit = this.esEditar();
    const id = this.$id();
    const category: Category = this.categoryForm.value();

    const operations = isEdit
      ? this.categoryService.update(id, category)
      : this.categoryService.save(category);

    operations.subscribe({
      next: () => {
        this.notificationService.notify(isEdit ? 'UPDATED' : 'CREATED');
        this.dialogRef.close('ok');
      },
      error: (err) => {
        console.log(err.status);
        console.log(err.error?.message);
      },
    });
  }
}
