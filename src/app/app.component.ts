import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Transaction } from './models/transaction.model';
import { TransactionService } from './services/transaction.service';
import { pastDateValidator } from './validators/past-date.validator';
import { validExtensionsValidator } from './validators/valid-extensions.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TransactionService],
})
export class AppComponent implements OnInit {
  columns: {
    field: keyof Transaction;
    header: string;
    isReadonly?: boolean;
  }[] = [
    { field: 'id', header: 'ID', isReadonly: true },
    { field: 'applicationName', header: 'Application Name' },
    { field: 'email', header: 'Email' },
    { field: 'inception', header: 'Inception' },
    { field: 'amount', header: 'Amount' },
    { field: 'filename', header: 'Filename' },
    { field: 'url', header: 'URL' },
    { field: 'allocation', header: 'Allocation' },
  ];

  form!: FormGroup;

  constructor(private readonly transcactionService: TransactionService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      transactions: new FormArray([]),
    });
    this.transcactionService.getTransactions().subscribe((data) => {
      data.forEach((transaction) => {
        this.transactions.push(this.createTransactionItem(transaction));
      });
    });
  }

  get transactions(): FormArray {
    return this.form.get('transactions') as FormArray;
  }

  addTransaction(): void {
    this.transactions.push(
      this.createTransactionItem({
        id: '',
        applicationName: '',
        email: '',
        inception: new Date(),
        amount: 0,
      })
    );
  }

  removeTransaction(index: number): void {
    this.transactions.removeAt(index);
  }

  async save(index: number) {
    const transaction = this.transactions.at(index).value as Transaction;
    await this.transcactionService
      .saveTransaction(transaction)
      .then((data) => {
        this.transactions.at(index).patchValue({ id: data.id });
      })
      .catch((error) => {
        this.removeTransaction(index);
      });
  }

  private createTransactionItem(transaction: Transaction): FormGroup {
    return new FormGroup({
      id: new FormControl(transaction.id),
      applicationName: new FormControl(transaction.applicationName, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      email: new FormControl(transaction.email, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      inception: new FormControl(transaction.inception, [
        Validators.required,
        pastDateValidator,
      ]),
      amount: new FormControl(transaction.amount, Validators.required),
      filename: new FormControl(transaction.filename, [
        Validators.maxLength(300),
        validExtensionsValidator(['png', 'mp3', 'tiff', 'xls', 'pdf']),
      ]),
      url: new FormControl(
        transaction.url,
        Validators.pattern('^(http|https)://[^ "]+$')
      ),
      allocation: new FormControl(transaction.allocation, [
        Validators.min(0),
        Validators.max(100),
      ]),
    });
  }
}
