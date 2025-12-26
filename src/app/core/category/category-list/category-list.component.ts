import {Component, Input} from '@angular/core';
import {CategoriesByBank, Category} from "../../../models/models";
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from "primeng/accordion";
import {TableModule} from "primeng/table";
import {Chip} from "primeng/chip";
import {KeyValuePipe, NgForOf} from "@angular/common";
import {Fieldset} from "primeng/fieldset";

@Component({
    selector: 'category-list',
    templateUrl: './category-list.component.html',
    imports: [
        Accordion,
        AccordionPanel,
        AccordionContent,
        AccordionHeader,
        TableModule,
        Chip,
        NgForOf,
        KeyValuePipe,
        Fieldset
    ],
    styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
    @Input()
    categories: Category[] = [];
    @Input()
    categoriesByBank!: CategoriesByBank;
    protected readonly JSON = JSON;
}
