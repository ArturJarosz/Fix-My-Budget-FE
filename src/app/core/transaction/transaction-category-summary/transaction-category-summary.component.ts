import {Component, Input, OnChanges} from '@angular/core';
import {BankTransaction, Category, TransactionType} from '../../../models/models';
import {Fieldset} from 'primeng/fieldset';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, NgIf} from '@angular/common';
import {StyleClass} from "primeng/styleclass";
import {Tag} from "primeng/tag";
import {Button, ButtonDirective} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {EditCategoryComponent} from "../../category/edit-category/edit-category.component";

interface CategorySummaryRow {
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
        CurrencyPipe,
        NgIf,
        StyleClass,
        Tag,
        ButtonDirective,
        Ripple,
        Button,
        EditCategoryComponent
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
    protected showEditCategoryDialog: boolean = false;
    categoryToEdit: Category | undefined;

    ngOnChanges(): void {
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

    resolveFontColor(bgColor: string | null | undefined): string {
        if (!bgColor) {
            return this.DEFAULT_ERROR_COLOR;
        }

        // normalize: remove '#', handle short form if needed
        let hex = bgColor.replace('#', '')
            .trim();
        if (hex.length === 3) {
            // e.g. 'abc' -> 'aabbcc'
            hex = hex.split('')
                .map(ch => ch + ch)
                .join('');
        }
        if (hex.length !== 6) {
            // fallback if color is not in expected format
            return this.DEFAULT_ERROR_COLOR;
        }

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // relative luminance (sRGB)
        const [rl, gl, bl] = [r, g, b].map(c => {
            const channel = c / 255;
            return channel <= 0.03928
                ? channel / 12.92
                : Math.pow((channel + 0.055) / 1.055, 2.4);
        });

        const luminance = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;

        // threshold: if too dark, use white; otherwise black
        return luminance < this.FONT_COLOR_THRESHOLD ? this.LIGHT_FONT_COLOR : this.DARK_FONT_COLOR;
    }

    onCategoryEditClick(category: Category) {
        this.categoryToEdit = category;
        this.showEditCategoryDialog = true;
    }

    protected onNotify($event: boolean) {
        this.showEditCategoryDialog = $event.valueOf();
    }
}
