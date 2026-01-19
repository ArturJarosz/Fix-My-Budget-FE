import {Component, Input, OnChanges} from '@angular/core';
import {Category, TransactionsCategorySummariesByType, TransactionType} from '../../../models/models';
import {Fieldset} from 'primeng/fieldset';
import {TableModule} from 'primeng/table';
import {Button} from "primeng/button";
import {
    TransactionCategorySummaryTableComponent
} from "../transaction-category-summary-table/transaction-category-summary-table.component";
import {AddCategoryComponent} from "../../category/add-category/add-category.component";

export interface CategorySummaryRow {
    categoryName: string;
    transactionCount: number;
    totalAmount: number;
    color: string;
    side: 'income' | 'expense';
    category: Category;
}

@Component({
    selector: 'transaction-category-summary',
    standalone: true,
    imports: [
        Fieldset,
        TableModule,
        Button,
        AddCategoryComponent,
        TransactionCategorySummaryTableComponent
    ],
    templateUrl: './transaction-category-summary.component.html',
    styleUrl: './transaction-category-summary.component.css'
})
export class TransactionCategorySummaryComponent implements OnChanges {
    readonly UNCATEGORIZED = 'UNCATEGORIZED';

    @Input()
    bankName!: string;
    @Input()
    categoriesSummaryByType!: TransactionsCategorySummariesByType;
    @Input()
    categories!: Category[];
    @Input()
    fieldTypes!: string[];
    @Input()
    matchTypes!: string[];
    @Input()
    banks!: string[];
    @Input()
    categoriesToIgnoreInSummary: Set<String> = new Set<String>();

    isSingleBank = false;

    totalIncome = 0;
    totalExpense = 0;
    protected showAddCategoryDialog: boolean = false;

    ngOnChanges(): void {
        this.recalculate();
        this.isCategoryManyAvailable();
    }

    private recalculate(): void {
        let isSummary = this.bankName == 'ALL';
        this.totalIncome = 0;
        this.totalExpense = 0;
        if (!this.categoriesSummaryByType) {
            return;
        }
        if (!this.categoriesSummaryByType.INCOME && !this.categoriesSummaryByType.EXPENSE) {
            return;
        }

        let totalIncome = 0;
        let totalExpense = 0;

        if (!this.categoriesSummaryByType.INCOME) {
            this.categoriesSummaryByType.INCOME = [];
        }
        if (!this.categoriesSummaryByType.EXPENSE) {
            this.categoriesSummaryByType.EXPENSE = [];
        }
        for (const summary of this.categoriesSummaryByType.INCOME) {
            let category = this.categories.find(c => c.name === summary.name);
            let shouldIgnore = isSummary ? this.categoriesToIgnoreInSummary.has(summary.name): category?.ignoreInBank;
            if (!shouldIgnore) {
                totalIncome += Number(summary.totalAmount);
            }

        }
        for (const summary of this.categoriesSummaryByType.EXPENSE) {
            let category = this.categories.find(c => c.name === summary.name);
            let shouldIgnore = isSummary ? this.categoriesToIgnoreInSummary.has(summary.name): category?.ignoreInBank;
            if (!shouldIgnore) {
                totalExpense += Number(summary.totalAmount);
            }
        }

        for (const category of this.categories) {
            let categoryName = category.name;
            if (this.categoriesSummaryByType[TransactionType.EXPENSE] && !this.categoriesSummaryByType[TransactionType.EXPENSE]!.find(
                    r => r.name === categoryName) && this.categoriesSummaryByType[TransactionType.INCOME] &&
                !this.categoriesSummaryByType[TransactionType.INCOME]!.find(
                    r => r.name === categoryName)) {
                this.categoriesSummaryByType[TransactionType.EXPENSE]!.push({
                    name: categoryName,
                    count: 0,
                    totalAmount: "0",
                    type: TransactionType.EXPENSE
                });
            }
        }

        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;

    }

    toggleShowAddCategoryDialog(): void {
        this.showAddCategoryDialog = true;
    }

    protected onNotifyAdd($even: boolean) {
        this.showAddCategoryDialog = $even.valueOf();
    }

    protected readonly TransactionType = TransactionType;

    protected isCategoryManyAvailable() {
        this.isSingleBank = this.bankName != 'ALL'
    }
}
