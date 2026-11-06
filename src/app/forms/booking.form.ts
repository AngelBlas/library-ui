import { Service, signal } from '@angular/core';
import { Customer } from '../model/customer';
import { Book } from '../model/book';
import { form } from '@angular/forms/signals';

@Service({ autoProvided: false })
export class BookinWizardForm {
  readonly model = signal<BookingWizardFormModel>(emptyBookinWizard());
  readonly form = form(this.model);

  value() {
    return this.model();
  }

  reset() {
    this.model.set(emptyBookinWizard());
  }
}

const emptyBookinWizard = (): BookingWizardFormModel => ({
  customer: null,
  reservationDate: null,
  books: null,
});

export interface BookingWizardFormModel {
  customer: number | null;
  reservationDate: Date | null;
  books: Array<number> | null;
}
