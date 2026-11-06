import { httpResource } from "@angular/common/http";
import { computed, inject, Service, signal } from "@angular/core";
import { Book } from "../model/book";
import { BookService } from "../services/book.service";

@Service({ autoProvided: false})
export class BookEditStore{

    private readonly bookService = inject(BookService)
    readonly $id = signal<number| null>(null)

    private readonly $bookRequest = computed(()=> {
        const id = this.$id()
        return id ? `${this.bookService.resourceUrl}/${id}` : undefined
    })

    readonly bookResource = httpResource<Book>(()=> this.$bookRequest())

    setId(id: number | null){
        this.$id.set(id)
    }
}