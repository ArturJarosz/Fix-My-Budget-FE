import {Component, effect, inject, OnInit, Signal} from '@angular/core';
import {TransactionStore} from "../state/transaction.state";
import {BankTransaction, Category} from "../../../models/models";
import {TransactionListComponent} from "../transaction-list/transaction-list.component";
import {TransactionSmallChartComponent} from "../transaction-small-chart/transaction-small-chart.component";
import {TransactionBigChartComponent} from "../transaction-big-chart/transaction-big-chart.component";
import {CategoryStore} from "../../category/state/category.state";
import {
    TransactionCategorySummaryComponent
} from "../transaction-category-summary/transaction-category-summary.component";

@Component({
    selector: 'app-transaction-screen',
    imports: [
        TransactionListComponent,
        TransactionBigChartComponent,
        TransactionCategorySummaryComponent
    ],
    templateUrl: './transaction-screen.component.html',
    styleUrl: './transaction-screen.component.css'
})
export class TransactionScreenComponent implements OnInit {
    transactionStore = inject(TransactionStore)
    categoryStore = inject(CategoryStore);

    $transactions: Signal<BankTransaction[]> = this.transactionStore.transactions;
    $categories: Signal<Category[]> = this.categoryStore.categories;

    constructor() {
        effect(() => {
            this.transactionStore.loadTransactions({});
        });
    }

    ngOnInit(): void {
        this.transactionStore.loadTransactions({});
    }
}
