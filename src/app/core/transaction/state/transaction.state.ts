import {AnalyzedStatement, BankTransaction} from "../../../models/models";
import {patchState, signalStore, withMethods, withState} from "@ngrx/signals";
import {inject} from "@angular/core";
import {TransactionGraphqlService} from "../graphql/graphql-service";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {pipe, switchMap, tap} from "rxjs";
import {TransactionRestService} from "../rest/transaction-rest.service";

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
    withMethods(
        (store, graphQlService = inject(TransactionGraphqlService), restService = inject(TransactionRestService)) => {
            const reloadTransactions$ = () => {
                return graphQlService.getTransactions()
                    .pipe(
                        tap(bankTransactions => {
                            patchState(store, {transactions: bankTransactions})
                        })
                    );
            }
            return {
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
            ),
            recalculateTransactionsCategories: rxMethod<{bank: string}>(
                pipe(
                    switchMap((params) => {
                        return restService.recalculateTransactionCategories(params.bank)
                            .pipe(
                                tap(() => {
                                    reloadTransactions$();
                                })
                            );
                    })
                )
            )}

        })
)
