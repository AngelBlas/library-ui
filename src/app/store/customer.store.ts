import { inject, Service } from "@angular/core";
import { CustomerService } from "../services/customer.service";
import { httpResource } from "@angular/common/http";
import { Customer } from "../model/customer";

@Service({autoProvided: false})
export class CustomerStore {

    private readonly customerService = inject(CustomerService)

    readonly customerResources = httpResource<Customer[]>(()=> this.customerService.resourceUrl, {
        defaultValue: []
    })

    readonly $customers = this.customerResources.value
    readonly $loading = this.customerResources.isLoading
    readonly $error = this.customerResources.error

    reload(){
        this.customerResources.reload()
    }
}