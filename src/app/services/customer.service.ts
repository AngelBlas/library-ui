import { Service } from '@angular/core';
import { GenericService } from './generic.service';
import { Customer } from '../model/customer';
import { environment } from '../../environments/environment.development';

@Service()
export class CustomerService extends GenericService<Customer> {
    protected override url = `${environment.HOST}/v1/customers`
}
