export interface Transaction {
  id: string;
  applicationName: string;
  email: string;
  inception: Date;
  amount: number;
  filename?: string;
  url?: string;
  allocation?: number;
}

export type TransactionDataColumn = {
  field: keyof Transaction;
  header: string;
  type: string;
  isReadonly?: boolean;
};
