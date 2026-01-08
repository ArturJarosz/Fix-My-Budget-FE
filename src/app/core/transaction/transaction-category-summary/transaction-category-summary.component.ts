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

    readonly DEFAULT_ERROR_COLOR = '#000000';
    readonly DEFAULT_FALLBACK_COLOR = '#888888';

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

    totalIncome = 0;
    totalExpense = 0;
    protected showAddCategoryDialog: boolean = false;

    ngOnChanges(): void {
        this.recalculate();
    }

    private recalculate(): void {
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
            totalIncome += Number(summary.totalAmount);
        }
        for (const summary of this.categoriesSummaryByType.EXPENSE) {
            totalExpense += Number(summary.totalAmount);
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

    resolveColor(categoryName?: string | null): string {
        if (!categoryName || !this.categories) {
            return this.DEFAULT_ERROR_COLOR;
        }
        const category = this.categories.find(c => c.name === categoryName);
        return category?.color ?? this.DEFAULT_FALLBACK_COLOR;
    }

    toggleShowAddCategoryDialog(): void {
        this.showAddCategoryDialog = true;
    }

    protected onNotifyAdd($even: boolean) {
        this.showAddCategoryDialog = $even.valueOf();
    }

    protected readonly TransactionType = TransactionType;
}
