import {Component, inject, Input} from '@angular/core';
import {CurrencyPipe, NgIf} from "@angular/common";
import {Button, ButtonDirective} from "primeng/button";
import {TableModule} from "primeng/table";
import {Tag} from "primeng/tag";
import {StyleClass} from "primeng/styleclass";
import {Ripple} from "primeng/ripple";
import {CategorySummaryRow} from "../transaction-category-summary/transaction-category-summary.component";
import {Category, TransactionsCategorySummary} from "../../../models/models";
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

    categoryStore = inject(CategoryStore);
    @Input()
    pageTitle!: string;
    @Input()
    fieldTypes!: string[];
    @Input()
    matchTypes!: string[];
    @Input()
    banks!: string[];
    @Input()
    categories!: Category[];
    @Input()
    rows: TransactionsCategorySummary[] = [];
    @Input()
    total = 0;

    protected showEditCategoryDialog: boolean = false;
    categoryToEdit: Category | undefined;

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

    protected onCategoryEditClick(categoryName: string) {
        this.categoryToEdit = this.categories.find(c => c.name === categoryName);
        this.showEditCategoryDialog = true;
    }

    protected onNotify($event: boolean) {
        this.showEditCategoryDialog = $event.valueOf();
    }

    protected onRemoveCategoryClicked(categoryName: string) {
        let categoryToRemove = this.categories.find(c => c.name === categoryName);
        this.categoryStore.removeCategory({ categoryId: categoryToRemove!.id! });
    }

}
