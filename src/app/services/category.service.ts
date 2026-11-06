import { Service } from "@angular/core";
import { GenericService } from "./generic.service";
import { Category } from "../model/category";
import { environment } from "../../environments/environment.development";

@Service()
export class CategoryService extends GenericService<Category> {
    protected override url = `${environment.HOST}/v1/categories`
}