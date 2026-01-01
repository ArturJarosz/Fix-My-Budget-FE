import {Injectable} from "@angular/core";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {environment} from "../../../../environments/environment";

export abstract class TransactionRestService {

    abstract recalculateTransactionCategories(bank: string): Observable<Object>;
}

@Injectable()
export class TransactionRestServiceImpl extends TransactionRestService {
    private transactionsUrl = `${environment.apiUrl}/api/bank-transactions`;

    constructor(private httpClient:HttpClient) {
        super();
    }

    recalculateTransactionCategories(bank: string): Observable<Object> {
        return this.httpClient.post(this.transactionsUrl + '/calculate-categories', {bank: bank})
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
