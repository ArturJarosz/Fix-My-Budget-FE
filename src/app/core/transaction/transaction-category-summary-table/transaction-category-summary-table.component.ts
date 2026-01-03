import {Component, inject, Input} from '@angular/core';
import {CurrencyPipe, NgIf} from "@angular/common";
import {Button, ButtonDirective} from "primeng/button";
import {TableModule} from "primeng/table";
import {Tag} from "primeng/tag";
import {StyleClass} from "primeng/styleclass";
import {Ripple} from "primeng/ripple";
import {CategorySummaryRow} from "../transaction-category-summary/transaction-category-summary.component";
import {Category} from "../../../models/models";
import {CategoryStore} from "../../category/state/category.state";
import {EditCategoryComponent} from "../../category/edit-category/edit-category.component";

@Component({
    selector: 'transaction-category-summary-table',
    imports: [
        CurrencyPipe,
        Button,
        TableModule,
        NgIf,
        Tag,
        StyleClass,
        ButtonDirective,
        Ripple,
        EditCategoryComponent
    ],
    templateUrl: './transaction-category-summary-table.component.html',
    styleUrl: './transaction-category-summary-table.component.css'
})
export class TransactionCategorySummaryTableComponent {
    readonly UNCATEGORIZED = 'UNCATEGORIZED';

    readonly DEFAULT_ERROR_COLOR = '#000000';
    readonly DEFAULT_FALLBACK_COLOR = '#888888';

    readonly DARK_FONT_COLOR = '#000000';
    readonly LIGHT_FONT_COLOR = '#FFFFFF';
    readonly FONT_COLOR_THRESHOLD = 0.5;

    categoryStore = inject(CategoryStore);

    @Input()
    fieldTypes!: string[];
    @Input()
    matchTypes!: string[];
    @Input()
    banks!: string[];
    @Input()
    categories!: Category[];
    @Input()
    rows: CategorySummaryRow[] = [];
    @Input()
    total = 0;

    protected showEditCategoryDialog: boolean = false;
    categoryToEdit: Category | undefined;

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

    protected onCategoryEditClick(category: Category) {
        this.categoryToEdit = category;
        this.showEditCategoryDialog = true;
    }

    protected onNotify($event: boolean) {
        this.showEditCategoryDialog = $event.valueOf();
    }

    protected onRemoveCategoryClicked(categoryId: number) {
        this.categoryStore.removeCategory({ categoryId });
    }

}
