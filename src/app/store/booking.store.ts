import { inject, Service } from "@angular/core";
import { BookingService } from "../services/booking.service";
import { httpResource } from "@angular/common/http";
import { BookingResponse } from "../model/booking";


@Service({autoProvided: false})
export class BookingStore {
    private readonly bookingService = inject(BookingService)

    readonly bookResources = httpResource<BookingResponse[]>(()=> this.bookingService.resourceUrl, {
        defaultValue:[]
    })

    readonly $bookings = this.bookResources.value
    readonly $loadking = this.bookResources.isLoading
    readonly $error = this.bookResources.error

    reload(){
        this.bookResources.reload()
    }
}