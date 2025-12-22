import {patchState, signalStore, withMethods, withState} from "@ngrx/signals";
import {BankStatementRestService} from "../rest/bank-statement-rest.service";
import {inject} from "@angular/core";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {UploadBankStatement} from "../../../models/models";
import {pipe, switchMap, tap} from "rxjs";

export interface BankStatementState {
    uploaded: boolean;
}

export const initialState: BankStatementState = {
    uploaded: false
}

export const BankStatementStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods((store, restService = inject(BankStatementRestService)) => ({
        uploadFile: rxMethod<{ uploadDtoForm: UploadBankStatement }>(
            pipe(
                switchMap((uploadDto) => {
                    return restService.uploadBankStatement(uploadDto.uploadDtoForm)
                        .pipe(
                            tap(bankTransactions => {
                                patchState(store, {uploaded: true})
                            })
                        );
                })
            )
        )
    }))
)
