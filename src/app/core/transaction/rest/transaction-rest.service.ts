import {Injectable} from "@angular/core";
import {throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MessageService} from "primeng/api";

export abstract class TransactionRestService {
}

@Injectable()
export class TransactionRestServiceImpl extends TransactionRestService {

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
