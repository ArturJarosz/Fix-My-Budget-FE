import {BankTransaction} from "../../../models/models";
import {signalStore, withMethods, withState} from "@ngrx/signals";

export interface TransactionState {
    transactions: BankTransaction[];
}

export const initialState: TransactionState = {
    transactions: []
}

export const TransactionStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods((store) => ({}))
)
