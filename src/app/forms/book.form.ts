import { Service, signal } from "@angular/core";
import { Book } from "../model/book";
import { form, required } from "@angular/forms/signals";

@Service({autoProvided: false})
export class BookForm {
    readonly $model = signal<Book>(emptyBook())

    readonly $form = form(this.$model, (path)=>{
        required(path.title)
        required(path.author)
        required(path.category)
        required(path.isbn)
        required(path.available)
    })

    readonly $isInvalid = () => this.$form().invalid()

    patch(book: Book){
        this.$model.set(book)
    }

    value(){
        return this.$model()
    }
}

const emptyBook = () : Book => ({
    bookId : null,
    title : '',
    author : '',
    isbn : '',
    available : '',
    category : '',
})