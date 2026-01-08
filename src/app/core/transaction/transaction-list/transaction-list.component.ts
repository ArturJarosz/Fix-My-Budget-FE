import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {BankTransaction, Category} from "../../../models/models";
import {Table, TableModule} from "primeng/table";
import {CurrencyPipe, NgClass, NgIf, NgStyle} from "@angular/common";
import {Tag} from "primeng/tag";
import {StyleClass} from "primeng/styleclass";
import {Fieldset} from "primeng/fieldset";

@Component({
    selector: 'transaction-list',
    templateUrl: './transaction-list.component.html',
    imports: [
        TableModule,
        CurrencyPipe,
        Tag,
        StyleClass,
        NgIf,
        Fieldset,
        NgClass,
        NgStyle
    ],
    styleUrl: './transaction-list.component.less'
})
export class TransactionListComponent {
    @ViewChild('txTable') txTable!: Table;

    @Input()
    transactions!: BankTransaction[];
    @Input()
    categories!: Category[];

    /** which filter field is currently hovered in the body cells */
    hoveredField: string | null = null;

    constructor(private elRef: ElementRef<HTMLElement>) {
    }

    resolveColor(categoryName?: string | null): string {
        if (!categoryName || !this.categories) {
            return '#000000';
        }
        const category = this.categories.find(c => c.name === categoryName);
        return category?.color ?? '#888888';
    }

    resolveFontColor(categoryName?: string | null): string {
        if (!categoryName) {
            return '#000000';
        }
        if ('UNCATEGORIZED' === categoryName) {
            return '#FFFFFF';
        }
        return this.categories.find(c => c.name === categoryName)?.fontColor!;
    }

    onFilterCellClick(field: string, value: string | null | undefined, event: MouseEvent): void {
        event.stopPropagation();

        if (!this.txTable || value == null) {
            return;
        }

        const text = String(value).trim();
        if (!text) {
            return;
        }

        this.txTable.filter(text, field, 'contains');
    }

    onFilterCellHover(field: string, active: boolean): void {
        this.hoveredField = active ? field : null;
    }

    getCategoryStyles(transaction: BankTransaction | undefined | null) {
        if (!transaction) {
            return {};
        }

        const backgroundColor = this.resolveColor(transaction.category);
        const fontColor = this.resolveFontColor(transaction.category);

        return {
            'background-color': backgroundColor,
            'border-color': backgroundColor,
            'color': fontColor
        };
    }
}
