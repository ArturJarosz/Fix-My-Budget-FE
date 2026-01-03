import {Component, inject, Input, OnChanges} from '@angular/core';
import {BankTransaction, Category, TransactionType} from '../../../models/models';
import {Fieldset} from 'primeng/fieldset';
import {TableModule} from 'primeng/table';
import {Button} from "primeng/button";
import {EditCategoryComponent} from "../../category/edit-category/edit-category.component";
import {AddCategoryComponent} from "../../category/add-category/add-category.component";
import {CategoryStore} from "../../category/state/category.state";
import {
    TransactionCategorySummaryTableComponent
} from "../transaction-category-summary-table/transaction-category-summary-table.component";

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

    readonly DARK_FONT_COLOR = '#000000';
    readonly LIGHT_FONT_COLOR = '#FFFFFF';
    readonly FONT_COLOR_THRESHOLD = 0.5;

    @Input()
    transactions!: BankTransaction[];
    @Input()
    categories!: Category[];
    @Input()
    fieldTypes!: string[];
    @Input()
    matchTypes!: string[];
    @Input()
    banks!: string[];

    expenseRows: CategorySummaryRow[] = [];
    incomeRows: CategorySummaryRow[] = [];
    totalIncome = 0;
    totalExpense = 0;
    protected showAddCategoryDialog: boolean = false;

    ngOnChanges(): void {
        console.log("changes")
        console.log("transactions", this.transactions.length)
        console.log("categories", this.categories.length)
        this.recalculate();
    }

    private recalculate(): void {
        this.expenseRows = [];
        this.incomeRows = [];
        this.totalIncome = 0;
        this.totalExpense = 0;
        if (!this.transactions || this.transactions.length === 0) {
            return;
        }

        // side per category based on first transaction
        const categorySide: Record<string, 'income' | 'expense'> = {};
        const summaryMap: Record<string, { count: number; total: number }> = {};

        for (const transaction of this.transactions) {
            const rawAmount = transaction.amount;
            if (rawAmount === 0) {
                continue;
            }

            const categoryName = transaction.category || this.UNCATEGORIZED;
            const isIncome = transaction.transactionType === TransactionType.INCOME;
            const absAmount = Math.abs(rawAmount);

            if (!categorySide[categoryName]) {
                categorySide[categoryName] = isIncome ? 'income' : 'expense';
            }

            summaryMap[categoryName] ??= {count: 0, total: 0};
            summaryMap[categoryName].count += 1;
            summaryMap[categoryName].total += absAmount;
        }

        const rows: CategorySummaryRow[] = [];
        let totalIncome = 0;
        let totalExpense = 0;

        for (const [categoryName, summary] of Object.entries(summaryMap)) {
            const side = categorySide[categoryName] ?? 'expense';
            const color = this.resolveColor(categoryName);
            const category = this.categories?.find(c => c.name === categoryName)!;

            if (side === 'income') {
                this.incomeRows.push({
                    categoryName,
                    transactionCount: summary.count,
                    totalAmount: summary.total,
                    color,
                    side,
                    category
                });
            } else {
                this.expenseRows.push({
                    categoryName,
                    transactionCount: summary.count,
                    totalAmount: summary.total,
                    color,
                    side,
                    category
                });
            }

            if (side === 'income') {
                totalIncome += summary.total;
            } else {
                totalExpense += summary.total;
            }
        }

        for (const category of this.categories) {
            let categoryName = category.name;
            if (!this.incomeRows.find(r => r.categoryName === categoryName) && !this.expenseRows.find(
                r => r.categoryName === categoryName)) {
                this.expenseRows.push({
                    categoryName,
                    transactionCount: 0,
                    totalAmount: 0,
                    color: this.resolveColor(categoryName),
                    side: 'expense',
                    category
                });
            }
        }

        rows.sort((a, b) => {
            if (a.side !== b.side) {
                return a.side === 'income' ? -1 : 1; // income first
            }
            return b.totalAmount - a.totalAmount;
        });

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

}
