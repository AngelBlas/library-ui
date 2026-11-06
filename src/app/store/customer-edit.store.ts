import { computed, inject, Service, signal } from "@angular/core";
import { CustomerService } from "../services/customer.service";
import { single } from "rxjs";
import { httpResource } from "@angular/common/http";
import { Customer } from "../model/customer";

@Service({autoProvided: false})
export class CustomerEditStore {

    private readonly customerService = inject(CustomerService)
    readonly $id = signal<number | null>(null)
    private readonly $customerRequest = computed(()=> {
        const id = this.$id()
        return id ? `${this.customerService.resourceUrl}/${id}` : undefined
    })

    readonly customerResource = httpResource<Customer>(()=> this.$customerRequest())

    setId(id: number | null) {
        this.$id.set(id)
    }
}