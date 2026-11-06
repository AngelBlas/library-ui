import { signal } from "@angular/core";
import { Category } from "../model/category";
import { form, maxLength, required } from "@angular/forms/signals";

export class CategoryForm {
    readonly $model = signal<Category>(emptyCategory())

    readonly $form = form(this.$model, (path) => {
        required(path.name)
        maxLength(path.name, 100)
        
        required(path.description)
        maxLength(path.description, 500)
        
        required(path.status)
    })

        readonly $isInvalid = () => this.$form().invalid()
    
        patch(category: Category){
            this.$model.set(category)
        }
    
        value(){
            return this.$model()
        }
}

const emptyCategory = () : Category => ({
    categoryId : null,
    name : '',
    description : '',
    status : ''
})