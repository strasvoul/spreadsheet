import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Transaction, TransactionDataColumn } from './models/transaction.model';
import { TransactionService } from './services/transaction.service';
import { pastDateValidator } from './validators/past-date.validator';
import { validExtensionsValidator } from './validators/valid-extensions.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TransactionService],
})
export class AppComponent implements OnInit, OnDestroy {
  columns: TransactionDataColumn[] = [
    { field: 'id', header: 'ID', type: 'text', isReadonly: true },
    { field: 'applicationName', header: 'Application Name', type: 'text' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'inception', header: 'Inception', type: 'date' },
    { field: 'amount', header: 'Amount', type: 'number' },
    { field: 'filename', header: 'Filename', type: 'text' },
    { field: 'url', header: 'URL', type: 'text' },
    { field: 'allocation', header: 'Allocation', type: 'number' },
  ];

  form!: FormGroup;
  private destroyed$ = new Subject<void>();

  constructor(private readonly transcactionService: TransactionService) {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      transactions: new FormArray([]),
    });
    this.transcactionService
      .getTransactions()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
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

  save(index: number) {
    const transaction = this.transactions.at(index).value as Transaction;
    if (transaction.id) {
      this.update(transaction);
    } else {
      this.saveNew(transaction, index);
    }
  }

  async saveNew(transaction: Transaction, index: number) {
    await this.transcactionService
      .saveTransaction(transaction)
      .then((data) => {
        this.transactions.at(index).patchValue({ id: data.id });
      })
      .catch((error) => {
        this.removeTransaction(index);
      });
  }

  async update(transaction: Transaction) {
    await this.transcactionService
      .updateTransaction(transaction)
      .then(() => {
        // TODO: display success message
      })
      .catch((error) => {
        // TODO: rollback changes
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
        Validators.email,
      ]),
      inception: new FormControl(transaction.inception, [
        Validators.required,
        pastDateValidator(),
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

  trackByFn(index: number, control: AbstractControl<Transaction>): string {
    return control.value.id;
  }
}
