export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE'

}

export interface BankTransaction {
    id: number;
    transactionDate: string;
    transactionType: TransactionType;
    amount: number;
    category?: string;
    categoryOverridden?: boolean;
    details?: string;
    recipientName?: string;
    senderName?: string;
    senderAccount?: string;
    recipientAccount?: string;
    source: string;
    transactionHash: string;

}

export interface CategorySummary {
    total: number;
    transactions: BankTransaction[];
}

export interface Summary {
    [categoryName: string]: CategorySummary;
}

export interface AnalyzedStatement {
    summary: Summary;
    transactions: BankTransaction[];
}

export interface OverrideCategory {
    category: string;
}




