import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FocuslyDirective } from '@zaybu/focusly';

@Component({
  selector: 'app-customer',
  imports: [FormsModule, FocuslyDirective],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss',
})
export class CustomerComponent {
  public model = {
    customerId: 'CUST-10493',
    status: 'Active',
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+44 7700 900123',
    country: 'United Kingdom',
    kycLevel: 'Standard',
    riskRating: 'Medium',
    address: '14 Market Street\nChester\nCH1 1AA\nUnited Kingdom',
    professionalClient: false,
    marketingOptIn: true,
    tradingEnabled: true,
  };
}
