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
    bank: string;
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

export interface UploadBankStatement {
    file: File;
    bank: string;
    source: string;
}

export interface ApplicationConfiguration {
    banks: string[];
    fieldTypes: string[];
    matchTypes: string[];
}

export interface FileResponse {
    fileName: string;
    blob: Blob;
}

export interface Category {
    id?: number | null;
    name: string;
    bankName: string;
    color: string;
    fontColor?: string;
    requirements: CategoryRequirement[];
    ignoreInBank: boolean;
    ignoreInSummary: boolean;
}

export interface CategoryRequirement {
    id?: number | null;
    fieldType: string;
    matchType: string;
    values: CategoryRequirementValue[];
}

export interface CategoryRequirementValue {
    id?: number | null;
    value: string;
}

export interface CategoriesByBank {
    [bankName: string]: Category[];
}

export interface CategoryNode {
    name?: string;
    bankName?: string;
    fieldType?: string;
    matchType?: string;
    value?: string;
}

export interface TransactionsCategorySummary {
    name: string;
    count: number;
    totalAmount: string; // BigDecimal is usually serialized as string
    type: TransactionType;
}

export interface TransactionsSummary {
    categorySummaryByTypeByBank: {
        [bank: string]: TransactionsCategorySummariesByType;
    };
    allBanksCategorySummaries: TransactionsCategorySummariesByType;
}

export type TransactionsCategorySummariesByType = {
    [type in TransactionType]?: TransactionsCategorySummary[];
};

export type BankSummaryData = {
    categoriesSummary: TransactionsCategorySummariesByType;
    transactions: BankTransaction[];
    categories: Category[];
}

export type BankTransactionCategoryOverride = {
    categoryName: string;
    override: boolean;
}

export type CategoryIgnoreStatus = {
    ignoreBank: boolean;
    ignoreSummary: boolean;
}

