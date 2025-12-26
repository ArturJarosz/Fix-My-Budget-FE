import {Component, effect, inject, OnInit, Signal} from '@angular/core';
import {TransactionStore} from "../state/transaction.state";
import {BankTransaction} from "../../../models/models";
import {TransactionListComponent} from "../transaction-list/transaction-list.component";
import {TransactionSmallChartComponent} from "../transaction-small-chart/transaction-small-chart.component";
import {TransactionBigChartComponent} from "../transaction-big-chart/transaction-big-chart.component";

@Component({
    selector: 'app-transaction-screen',
    imports: [
        TransactionListComponent,
        TransactionSmallChartComponent,
        TransactionBigChartComponent
    ],
    templateUrl: './transaction-screen.component.html',
    styleUrl: './transaction-screen.component.css'
})
export class TransactionScreenComponent implements OnInit {
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
}
