import {Component, inject, Input} from '@angular/core';
import {CurrencyPipe, NgClass, NgIf} from "@angular/common";
import {Button, ButtonDirective} from "primeng/button";
import {TableModule} from "primeng/table";
import {Tag} from "primeng/tag";
import {StyleClass} from "primeng/styleclass";
import {Ripple} from "primeng/ripple";
import {CategorySummaryRow} from "../transaction-category-summary/transaction-category-summary.component";
import {Category, CategoryIgnoreStatus, TransactionsCategorySummary} from "../../../models/models";
import {CategoryStore} from "../../category/state/category.state";
import {EditCategoryComponent} from "../../category/edit-category/edit-category.component";
import {EditIgnoreStatusComponent} from "../../category/edit-ignore-status/edit-ignore-status.component";

@Component({
    selector: 'transaction-category-summary-table',
    imports: [
        CurrencyPipe,
        Button,
        TableModule,
        NgIf,
        Tag,
        ButtonDirective,
        Ripple,
        EditCategoryComponent,
        StyleClass,
        EditIgnoreStatusComponent,
        NgClass
    ],
    templateUrl: './transaction-category-summary-table.component.html',
    styleUrl: './transaction-category-summary-table.component.css'
})
export class TransactionCategorySummaryTableComponent {
    readonly UNCATEGORIZED = 'UNCATEGORIZED';

    categoryStore = inject(CategoryStore);
    @Input()
    isSingleBank!: boolean;
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
    @Input()
    categoriesToIgnoreInSummary: Set<String> = new Set<String>();

    protected showEditCategoryDialog: boolean = false;
    categoryToEdit: Category | undefined;
    protected showUpdateIgnoreStatusDialog: boolean = false;
    categoryToEditIgnoreStatus: Category | undefined;

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
        return this.categories.find(c => c.name === categoryName)?.fontColor!;
    }

    protected onCategoryEditClick(categoryName: string) {
        this.categoryToEdit = this.categories.find(c => c.name === categoryName);
        this.showEditCategoryDialog = true;
    }

    protected onNotifyEdit($event: boolean) {
        this.showEditCategoryDialog = $event;
    }

    protected onNotifyIgnore($event: boolean) {
        this.showUpdateIgnoreStatusDialog = $event;
    }

    protected onRemoveCategoryClicked(categoryName: string) {
        let categoryToRemove = this.categories.find(c => c.name === categoryName);
        this.categoryStore.removeCategory({ categoryId: categoryToRemove!.id! });
    }

    protected onUpdateIgnoreStatus(categoryName: string) {
        this.categoryToEditIgnoreStatus = this.categories.find(c => c.name === categoryName);
        this.showUpdateIgnoreStatusDialog = true;
    }

    isIgnoredByBank(categoryName: string): boolean {
        if (this.isSingleBank) {
            const category = this.categories?.find(c => c.name === categoryName);
            return !!category && category.ignoreInBank;
        }
        return this.categoriesToIgnoreInSummary.has(categoryName);

    }
}
