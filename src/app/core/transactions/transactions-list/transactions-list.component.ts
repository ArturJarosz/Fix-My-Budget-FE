import {Component, effect, inject, OnChanges, OnInit, Signal, SimpleChanges} from '@angular/core';
import {TransactionStore} from "../state/transaction.state";
import {BankTransaction} from "../../../models/models";

@Component({
    selector: 'transactions-list',
    templateUrl: './transactions-list.component.html',
    styleUrl: './transactions-list.component.less',
    standalone: false
})
export class TransactionsListComponent implements OnInit {
    transactionStore = inject(TransactionStore)

    $transactions: Signal<BankTransaction[]> = this.transactionStore.transactions;

    constructor() {
        effect(() => {
            this.transactionStore.loadTransactions({});
        });
    }

    ngOnInit(): void {
        this.transactionStore.loadTransactions({});
    }

    onClick(): void {
        this.transactionStore.loadTransactions({});
    }
}
