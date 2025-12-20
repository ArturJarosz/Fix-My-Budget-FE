import {Injectable} from "@angular/core";
import {Apollo} from "apollo-angular";
import {
    AnalyzedStatementInput,
    GET_ANALYZED_STATEMENT,
    GET_SUMMARY,
    GET_TRANSACTIONS,
    SummaryInput
} from "./query-statement";
import {map, Observable} from "rxjs";
import {AnalyzedStatement, BankTransaction} from "src/app/models/models";


@Injectable({
    providedIn: 'root'
})
export class TransactionGraphqlService {

    constructor(private apollo: Apollo) {
    }

    getAnalyzedStatement(input?: AnalyzedStatementInput): Observable<any> {
        return this.apollo.query<{ analyzedStatement: any }>({
            query: GET_ANALYZED_STATEMENT,
            variables: {input},
            fetchPolicy: "cache-first"
        })
            .pipe(
                map(result => {
                    if (!result || !result.data) {
                        throw new Error('Analyzed statement data is missing or invalid.');
                    }
                    this.transformAnalyzedStatementResponse(result.data.analyzedStatement)
                })
            );
    }

    getSummary(input?: SummaryInput): Observable<any> {
        return this.apollo.query<{ summary: any[] }>({
            query: GET_SUMMARY,
            variables: {input},
            fetchPolicy: "network-only"
        })
            .pipe(
                map(result => {
                    if (!result || !result.data) {
                        throw new Error('Analyzed statement data is missing or invalid.');
                    }
                    this.transformSummaryResponse(result.data.summary)
                })
            );
    }

    getTransactions(): Observable<BankTransaction[]> {
        return this.apollo.query<{ response: any }>({
            query: GET_TRANSACTIONS,
            fetchPolicy: "network-only"
        })
            .pipe(
                map(result => {
                    if (!result || !result.data) {
                        throw new Error('Analyzed statement data is missing or invalid.');
                    }
                    return this.transformTransactionResponse(result);
                })
            );
    }

    private transformAnalyzedStatementResponse(data: any): AnalyzedStatement {
        const summary: any = {};

        if (data.summary) {
            data.summary.forEach((item: any) => {
                summary[item.categoryName] = item.categoryData;
            });
        }

        return {
            summary: summary,
            transactions: data.transactions || []
        };
    }

    private transformSummaryResponse(data: any[]): any {
        const summary: any = {};

        if (data) {
            data.forEach(item => {
                summary[item.categoryName] = item.categoryData;
            });
        }

        return summary;
    }

    private transformTransactionResponse(data: any | undefined): BankTransaction[] {
        if (!data) {
            return [];
        }
        const transactions: BankTransaction[] = [];
        data.data.allBankTransactions.forEach((item: BankTransaction) => transactions.push(item));
        return transactions;
    }
}
