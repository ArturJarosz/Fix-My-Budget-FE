import {Component, inject, Input} from '@angular/core';
import {CategoriesByBank, Category} from "../../../models/models";
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {Fieldset} from "primeng/fieldset";
import {TableModule} from "primeng/table";
import {Chip} from "primeng/chip";
import {KeyValuePipe, NgForOf} from "@angular/common";

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
        KeyValuePipe
    ],
    styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
    @Input()
    categories: Category[] = [];
    @Input()
    set categoriesByBank(value: CategoriesByBank) {
        console.log('CategoryList @Input categoriesByBank keys:', Object.keys(value || {}));
        console.log(" categories by bank refreshed!")
        this._categoriesByBank = value;
    }
    _categoriesByBank!: CategoriesByBank;
    protected readonly JSON = JSON;

    constructor() {
    }
}
