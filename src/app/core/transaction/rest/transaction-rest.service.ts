import {Injectable} from "@angular/core";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {environment} from "../../../../environments/environment";
import {BankTransaction, BankTransactionCategoryOverride, TransactionsSummary} from "../../../models/models";

export abstract class TransactionRestService {

    abstract recalculateTransactionCategories(bank: string): Observable<Object>;

    abstract getTransactionsSummary(): Observable<TransactionsSummary>;

    abstract overrideTransactionCategory(transactionId: number,
                                         override: BankTransactionCategoryOverride): Observable<BankTransaction>;
}

@Injectable()
export class TransactionRestServiceImpl extends TransactionRestService {
    private transactionsUrl = `${environment.apiUrl}/api/bank-transactions`;

    constructor(private httpClient: HttpClient) {
        super();
    }

    recalculateTransactionCategories(bank: string): Observable<Object> {
        return this.httpClient.post(this.transactionsUrl + '/calculate-categories', {bank: bank})
    }

    getTransactionsSummary(): Observable<TransactionsSummary> {
        return this.httpClient.get<TransactionsSummary>(this.transactionsUrl + '/summary');
    }

    overrideTransactionCategory(transactionId: number,
                                override: BankTransactionCategoryOverride): Observable<BankTransaction> {
        return this.httpClient.post<BankTransaction>(`${this.transactionsUrl}/${transactionId}/override-category`, {
            "categoryName": override.categoryName, override: override.override
        });
    }

    handleError(error: HttpErrorResponse, messageService: MessageService, title: string) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `An error occurred: ${error.error.message}`;
        } else {
            errorMessage = `Response code: ${error.status},\n Error: ${error.error.message ? error.error.message : error.message}`;
        }

        messageService.add({
            severity: "error",
            summary: title,
            detail: errorMessage,

        })
        return throwError(() => errorMessage);
    }
}
