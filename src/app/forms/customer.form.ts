import { Service, signal } from "@angular/core";
import { Customer } from "../model/customer";
import { signalGetFn } from "@angular/core/primitives/signals";
import { email, form, maxLength, required } from "@angular/forms/signals";

export class CustomerForm {
    readonly $model = signal<Customer>(emptyCustomer())
    readonly $form = form(this.$model, (path) => {
        required(path.firstName)
        maxLength(path.firstName, 200)

        required(path.lastName)
        maxLength(path.lastName, 200)

        required(path.cardId)
        maxLength(path.cardId, 10)

        required(path.email)
        maxLength(path.email, 100)
        email(path.email)
    })

    readonly $isInvalid = () => this.$form().invalid()

    patch(customer: Customer) {
        this.$model.set(customer)
    }

    value() {
        return this.$model()
    }
}

const emptyCustomer = (): Customer => ({
    customerId: null,
    firstName: '',
    lastName: '',
    cardId: '',
    email: ''
})