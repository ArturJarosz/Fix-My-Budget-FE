import {Injectable} from "@angular/core";
import {catchError, Observable, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UploadBankStatement} from "../../../models/models";

export abstract class BankStatementRestService {
    abstract uploadBankStatement(uploadBankStatement: UploadBankStatement): Observable<any>;
}

@Injectable()
export class BankStatementRestServiceImpl extends BankStatementRestService {
    private uploadBankStatementUrl = `${environment.apiUrl}/api/bank-transactions/upload`;


    constructor(private httpClient: HttpClient) {
        super();
    }

    override uploadBankStatement(uploadBankStatement: UploadBankStatement): Observable<any> {
        const formData = new FormData();
        formData.append('file', uploadBankStatement.file);
        formData.append('bank', uploadBankStatement.bank);
        formData.append('source', uploadBankStatement.source);
        return this.httpClient.post(this.uploadBankStatementUrl, formData)
            .pipe(
                catchError(error => throwError("Error uploading file " + error)),

            );
    }

}
