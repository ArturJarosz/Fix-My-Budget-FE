import {gql} from "@apollo/client";
import {BankTransaction, TransactionType} from "../../../models/models";

export const GET_ANALYZED_STATEMENT = gql`
    query GetAnalyzedStatement($input: AnalyzedStatementInput) {
        analyzedStatement(input: $input) {
            summary {
                categoryName
                categoryData {
                    total
                    transactions {
                        id
                        transactionDate
                        transactionType
                        amount
                        category
                        categoryOverridden
                        details
                        recipientName
                        senderName
                        senderAccount
                        recipientAccount
                        source
                        transactionHash
                    }
                }
            }
            transactions {
                id
                transactionDate
                transactionType
                amount
                category
                categoryOverridden
                details
                recipientName
                senderName
                senderAccount
                recipientAccount
                source
                transactionHash
            }
        }
    }
`;

export const GET_SUMMARY = gql`
    query GetSummary($input: SummaryInput) {
        summary(input: $input) {
            categoryName
            categoryData {
                total
                transactions {
                    id
                    transactionDate
                    transactionType
                    amount
                    category
                    categoryOverridden
                    details
                    recipientName
                    senderName
                    senderAccount
                    recipientAccount
                    source
                    transactionHash
                }
            }
        }
    }
`;

export const GET_TRANSACTIONS = gql`
    query {
        allBankTransactions {
            id
            amount
            transactionDate
            category
            transactionType
            details
            recipientName
            senderName
        }
    }
`;

export interface AnalyzedStatementInput {
    dateFrom?: string;
    dateTo?: string;
    source?: string;
    transactionType?: string;
}

export interface SummaryInput {
    dateFrom?: string;
    dateTo?: string;
    categories?: string[];
    transactionType?: string;
}

export interface TransactionInput {
    id?: number;
    transactionDate?: string;
    transactionType?: TransactionType;
    amount?: number;
    category?: string;
    categoryOverridden?: boolean;
    details?: string;
    recipientName?: string;
    senderName?: string;
    senderAccount?: string;
    recipientAccount?: string;
    source?: string;
}

export interface BankTransactionsResponse {
    data: {
        allBankTransactions: BankTransaction[];
    }
}
