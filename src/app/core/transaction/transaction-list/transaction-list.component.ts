import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {BankTransaction, Category} from "../../../models/models";
import {Table, TableModule} from "primeng/table";
import {CurrencyPipe, NgClass, NgIf} from "@angular/common";
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
        NgClass
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

    resolveFontColor(bgColor: string | null | undefined): string {
        if (!bgColor) {
            return '#000000';
        }

        // normalize: remove '#', handle short form if needed
        let hex = bgColor.replace('#', '').trim();
        if (hex.length === 3) {
            // e.g. 'abc' -> 'aabbcc'
            hex = hex.split('').map(ch => ch + ch).join('');
        }
        if (hex.length !== 6) {
            // fallback if color is not in expected format
            return '#000000';
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
        return luminance < 0.5 ? '#FFFFFF' : '#000000';
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
}
