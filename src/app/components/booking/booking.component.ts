import { Component, effect, inject, signal } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { FormRoot, FormField } from '@angular/forms/signals';
import { BookinWizardForm } from '../../forms/booking.form';
import { IndexKind } from 'typescript';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BookinWizardStore } from '../../store/booking-wizard.store';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { CustomDateAdapter } from '../../material/custom-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { single } from 'rxjs';
import { Booking } from '../../model/booking';
import { BookingService } from '../../services/booking.service';
import { NotificationService } from '../../shared/services/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  imports: [
    MatStepperModule,
    FormRoot,
    MatFormFieldModule,
    MatSelectModule,
    FormField,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
  ],
  selector: 'app-booking',
  styleUrl: './booking.component.css',
  templateUrl: './booking.component.html',
  providers: [
    BookinWizardForm,
    BookinWizardStore,
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],
})
export class BookingComponent {
  protected readonly bookingWizardForm = inject(BookinWizardForm);
  protected readonly bookingWizardStore = inject(BookinWizardStore);
  protected readonly bookingService = inject(BookingService);
  private readonly notificationService = inject(NotificationService);
    private readonly snackBar = inject(MatSnackBar);
  protected $customer = this.bookingWizardStore.$customer;
  protected $books = this.bookingWizardStore.$books;
  protected $detail = signal<Booking>({} as Booking);

  protected minDate = new Date();

  constructor(){
        effect(() => {
      const message = this.notificationService.$message();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
        this.notificationService.clear();
      }
    });
  }

  addBooks() {
    const det = new Booking();
    det.customerId = this.bookingWizardForm.value().customer;
    det.bookIds = this.bookingWizardForm.value().books;
    det.dateReservation = this.toLocalDateTimeString(
      this.bookingWizardForm.value().reservationDate,
    );
    console.log(JSON.stringify(det));
    const operations = this.bookingService.save(det);

    operations.subscribe({
      next: () => {
        this.notificationService.notify('CREATED');
      },
      error: (err) => {
        console.log(err.status);
        console.log(err.error?.message);
      },
    });
  }

  toLocalDateTimeString(date: Date | null): string | null {
    if (!date) return null;

    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
      `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    );
  }
}
