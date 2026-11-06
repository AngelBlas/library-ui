import { inject, Inject, Service } from '@angular/core';
import { BookService } from '../services/book.service';
import { httpResource } from '@angular/common/http';
import { Book } from '../model/book';

@Service({autoProvided: false})
export class BookStore {
  private readonly bookService = inject(BookService);

  readonly bookResources = httpResource<Book[]>(() => this.bookService.resourceUrl, {
    defaultValue: [],
  });

  readonly $books = this.bookResources.value;
  readonly $loading = this.bookResources.isLoading;
  readonly $error = this.bookResources.error;

  reload() {
    this.bookResources.reload();
  }
}
