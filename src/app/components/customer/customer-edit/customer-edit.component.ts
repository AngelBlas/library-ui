import { Component, computed, effect, inject } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CustomerForm } from '../../../forms/customer.form';
import { CustomerEditStore } from '../../../store/customer-edit.store';
import { CustomerService } from '../../../services/customer.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Customer } from '../../../model/customer';

@Component({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormRoot,
    FormField,
    MatDialogModule,
    MatSlideToggleModule,
  ],
  selector: 'app-customer-edit',
  styleUrl: './customer-edit.component.css',
  templateUrl: './customer-edit.component.html',
  providers: [CustomerForm, CustomerEditStore],
})
export class CustomerEditComponent {
  private readonly customerService = inject(CustomerService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<CustomerEditComponent>);

  protected readonly customerForm = inject(CustomerForm);
  protected readonly customerEditStore = inject(CustomerEditStore);
  protected readonly $inputData = inject<{ customerId?: number } | null>(MAT_DIALOG_DATA, {
    optional: true,
  });

  public $id = computed(() => {
    const id = this.$inputData?.customerId
    return id ? Number(id) : null
  })

  public esEditar = computed(()=> this.$id()!==null)

  constructor(){
    effect(()=> {
      this.customerEditStore.setId(this.$id())
    })

    effect(()=> {
      if(this.customerEditStore.customerResource.hasValue()){
        this.customerForm.patch(this.customerEditStore.customerResource.value())
      }
    })
  }

    operate() {
      console.log('operate method in');
      if (this.customerForm.$isInvalid()) return;
  
      const isEdit = this.esEditar();
      const id = this.$id();
      const customer: Customer = this.customerForm.value();
  
      const operations = isEdit ? this.customerService.update(id, customer) : this.customerService.save(customer);
  
      operations.subscribe({
        next: () => {
          this.notificationService.notify(isEdit ? 'UPDATED':'CREATED')
          this.dialogRef.close('ok');
        },
        error: (err) => {
          console.log(err.status);
          console.log(err.error?.message);
        },
      });
    }
}
