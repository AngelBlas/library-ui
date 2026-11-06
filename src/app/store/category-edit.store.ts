import { computed, inject, Service, signal } from "@angular/core";
import { CategoryService } from "../services/category.service";
import { httpResource } from "@angular/common/http";
import { Category } from "../model/category";

@Service({autoProvided: false})
export class CategoryEditStore {

    private readonly categoryuService = inject(CategoryService)
    
    readonly $id = signal<number| null>(null)

    private readonly $bookRequest = computed(()=> {
        const id = this.$id()
        return id ? `${this.categoryuService.resourceUrl}/${id}` : undefined
    })

    readonly bookResource = httpResource<Category>(()=> this.$bookRequest())

    setId(id: number | null){
        this.$id.set(id)
    }
}