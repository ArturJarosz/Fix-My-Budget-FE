import {AnalyzedStatement, BankTransaction} from "../../../models/models";
import {patchState, signalStore, withMethods, withState} from "@ngrx/signals";
import {inject} from "@angular/core";
import {TransactionGraphqlService} from "../graphql/graphql-service";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {pipe, switchMap, tap} from "rxjs";

export interface TransactionState {
    transactions: BankTransaction[];
    analyzedStatement?: AnalyzedStatement;
}

export const initialState: TransactionState = {
    transactions: [],
    analyzedStatement: undefined
}

export const TransactionStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods((store, graphQlService = inject(TransactionGraphqlService)) => ({
        loadTransactions: rxMethod<{}>(
            pipe(
                switchMap(() => {
                    return graphQlService.getTransactions()
                        .pipe(
                            tap(bankTransactions => {
                                patchState(store, {transactions: bankTransactions})
                            })
                        );
                })
            )
        )

    }))
)
