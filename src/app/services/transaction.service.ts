import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable, startWith } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TransactionService {
  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http
      .get<{ transactions: Transaction[] }>(
        '/assets/mock-data/transactions.json'
      )
      .pipe(
        map((data) => data.transactions.map((t) => ({ ...t, id: uuid() })))
      );
  }

  saveTransaction(transaction: Transaction): Promise<{ id: string }> {
    return firstValueFrom(
      this.http.post<{ id: string }>('/api/transactions', transaction).pipe(
        // Simulate a server response with a random id
        startWith({ id: uuid() })
      )
    );
  }

  updateTransaction(transaction: Transaction): Promise<{ id: string }> {
    return firstValueFrom(
      this.http
        .put<{ id: string }>(`/api/transactions/${transaction.id}`, transaction)
        .pipe(
          // Return the id of the updated transaction just for the sake of mocking the server response
          startWith({ id: transaction.id })
        )
    );
  }
}
