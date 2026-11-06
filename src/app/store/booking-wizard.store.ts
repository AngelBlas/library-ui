import { inject, Service } from "@angular/core";
import { CustomerService } from "../services/customer.service";
import { httpResource } from "@angular/common/http";
import { Customer } from "../model/customer";
import { BookService } from "../services/book.service";
import { Book } from "../model/book";

@Service( {autoProvided: false})
export class BookinWizardStore {
    private readonly customerService = inject(CustomerService)
    private readonly bookService = inject(BookService)

    readonly customerResource = httpResource<Customer[]>(() => this.customerService.resourceUrl, {defaultValue: []})
    readonly bookResource = httpResource<Book[]>(() => this.bookService.resourceUrl, {defaultValue: []})

    readonly $customer = this.customerResource.value
    readonly $books = this.bookResource.value
}