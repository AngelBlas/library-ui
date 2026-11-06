import { Routes } from '@angular/router';
import { BookComponent } from './components/book/book.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CategoryComponent } from './components/category/category.component';
import { BookingComponent } from './components/booking/booking.component';
import { ReportComponent } from './components/report/report.component';

export const routes: Routes = [
    {path: 'components/booking', component: BookingComponent},
    {path: 'components/book', component: BookComponent},
    {path: 'components/customer', component: CustomerComponent},
    {path: 'components/category', component: CategoryComponent},
    {path: 'components/report', component: ReportComponent}
];
