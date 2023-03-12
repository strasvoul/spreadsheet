import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable, of, startWith } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable()
export class TransactionService {
  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http
      .get<{ transactions: Transaction[] }>(
        '/assets/mock-data/transactions.json'
      )
      .pipe(map((data) => data.transactions));
  }

  saveTransaction(transaction: Transaction): Promise<{ id: string }> {
    return firstValueFrom(
      this.http
        .post<{ id: string }>('/api/transactions', transaction)
        .pipe(startWith({ id: '817c923f-59b5-49d1-b519' }))
    );
  }
}
