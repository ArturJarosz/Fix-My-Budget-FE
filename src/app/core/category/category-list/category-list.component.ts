import {Component, inject, Input} from '@angular/core';
import {CategoriesByBank, Category} from "../../../models/models";
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {Fieldset} from "primeng/fieldset";
import {TableModule} from "primeng/table";
import {Chip} from "primeng/chip";
import {KeyValuePipe, NgForOf, NgStyle} from "@angular/common";
import {ButtonDirective} from "primeng/button";
import {EditCategoryComponent} from "../edit-category/edit-category.component";

@Component({
    selector: 'category-list',
    templateUrl: './category-list.component.html',
    imports: [
        Accordion,
        AccordionPanel,
        AccordionHeader,
        AccordionContent,
        Fieldset,
        TableModule,
        Chip,
        NgForOf,
        KeyValuePipe,
        NgStyle,
        ButtonDirective,
        EditCategoryComponent
    ],
    styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
    @Input()
    categories: Category[] = [];
    @Input()
    fieldTypes!: string[];
    @Input()
    matchTypes!: string[];
    @Input()
    banks!: string[];
    @Input()
    set categoriesByBank(value: CategoriesByBank) {
        this._categoriesByBank = value;
    }
    _categoriesByBank!: CategoriesByBank;
    protected readonly JSON = JSON;

    showEditCategoryDialog = false;
    categoryToEdit!: Category;

    constructor() {
    }

    protected onEditCategory(category: Category) {
        this.showEditCategoryDialog = true;
        this.categoryToEdit = category;
    }

    protected toggleShowEditCategoryDialog() {
        this.showEditCategoryDialog = !this.showEditCategoryDialog;
    }

    protected onNotify($event: boolean) {
        this.showEditCategoryDialog = $event.valueOf();
    }
}
