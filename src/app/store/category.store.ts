import { inject, Inject, Service } from '@angular/core';
import { BookService } from '../services/book.service';
import { httpResource } from '@angular/common/http';
import { Book } from '../model/book';
import { CategoryService } from '../services/category.service';
import { Category } from '../model/category';

@Service({autoProvided: false})
export class CategoryStore {
  private readonly categoryService = inject(CategoryService);

  readonly categoryResource = httpResource<Category[]>(() => this.categoryService.resourceUrl, {
    defaultValue: [],
  });

  readonly $categories = this.categoryResource.value;
  readonly $loading = this.categoryResource.isLoading;
  readonly $error = this.categoryResource.error;

  reload() {
    this.categoryResource.reload();
  }
}
