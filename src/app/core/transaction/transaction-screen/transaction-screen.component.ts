import {Component, effect, inject, OnInit, Signal} from '@angular/core';
import {TransactionStore} from "../state/transaction.state";
import {BankSummaryData, BankTransaction, Category, TransactionsSummary} from "../../../models/models";
import {TransactionListComponent} from "../transaction-list/transaction-list.component";
import {TransactionBigChartComponent} from "../transaction-big-chart/transaction-big-chart.component";
import {CategoryStore} from "../../category/state/category.state";
import {
    TransactionCategorySummaryComponent
} from "../transaction-category-summary/transaction-category-summary.component";
import {ConfigurationStore} from "../../configuration/state/configuration.state";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "primeng/tabs";

@Component({
    selector: 'app-transaction-screen',
    imports: [
        TransactionListComponent,
        TransactionBigChartComponent,
        TransactionCategorySummaryComponent,
        Tabs,
        TabList,
        Tab,
        TabPanels,
        TabPanel
    ],
    templateUrl: './transaction-screen.component.html',
    styleUrl: './transaction-screen.component.css'
})
export class TransactionScreenComponent implements OnInit {
    transactionStore = inject(TransactionStore)
    categoryStore = inject(CategoryStore);
    configurationStore = inject(ConfigurationStore);

    $transactions: Signal<BankTransaction[]> = this.transactionStore.transactions;
    $transactionsSummary: Signal<TransactionsSummary> = this.transactionStore.transactionsSummary;
    $categories: Signal<Category[]> = this.categoryStore.categories;
    $banks: Signal<string[]> = this.configurationStore.banks
    $fieldTypes: Signal<string[]> = this.configurationStore.fieldTypes;
    $matchTypes: Signal<string[]> = this.configurationStore.matchTypes;
    banksSummaryData: Record<string, BankSummaryData> = {};

    constructor() {
        effect(() => {
            this.transactionStore.loadTransactions({});
            this.categoryStore.loadCategories({});
            this.configurationStore.loadConfiguration({});
        });
        effect(() => {
            let banks = this.$banks();
            let transactionSummaries = this.$transactionsSummary();
            let categories = this.$categories();
            this.preparePerBankData();
            this.prepareAllBanksData()
        });
    }

    ngOnInit(): void {
        this.transactionStore.loadTransactions({});
        this.categoryStore.loadCategories({});
        this.configurationStore.loadConfiguration({});
        this.transactionStore.loadTransactionsSummary({});
    }

    preparePerBankData() {
        this.banksSummaryData = {};
        this.$banks()
            .forEach((bank) => {
                let bankTransactions = this.$transactions()
                    .filter((transaction) => transaction.bank === bank);
                if (bankTransactions && bankTransactions.length > 0) {
                    this.banksSummaryData[bank] = {
                        categoriesSummary: this.$transactionsSummary().categorySummaryByTypeByBank[bank],
                        transactions: this.$transactions()
                            .filter((transaction) => transaction.bank === bank),
                        categories: this.$categories()
                            .filter((category) => category.bankName === bank)
                    }
                }
            });
    }

    prepareAllBanksData() {
        let allBankSummaryData: BankSummaryData = {
            transactions: [],
            categories: [],
            categoriesSummary: {}
        };

        allBankSummaryData.transactions = this.$transactions();
        allBankSummaryData.categories = this.mergeCategories();
        allBankSummaryData.categoriesSummary = this.$transactionsSummary().allBanksCategorySummaries;

        this.banksSummaryData['ALL'] = allBankSummaryData;
    }

    // removing duplicates from categories by category name
    private mergeCategories(): Category[] {
        let alreadyAddedCategories = new Set<string>();

        return this.$categories()
            .filter(category => {
                if (alreadyAddedCategories.has(category.name)) {
                    return false;
                }
                alreadyAddedCategories.add(category.name);
                return true;
            })
    }

    protected readonly Object = Object;
}
