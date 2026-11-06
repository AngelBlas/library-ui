import { Service } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { Booking } from "../model/booking";
import { GenericService } from "./generic.service";

@Service()
export class BookingService extends GenericService<Booking>{
    protected override url = `${environment.HOST}/v1/bookings`
}