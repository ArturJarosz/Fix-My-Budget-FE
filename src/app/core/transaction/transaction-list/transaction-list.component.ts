import {Component, Input} from '@angular/core';
import {BankTransaction} from "../../../models/models";
import {TableModule} from "primeng/table";
import {CurrencyPipe, NgIf} from "@angular/common";
import {Tag} from "primeng/tag";
import {StyleClass} from "primeng/styleclass";

@Component({
    selector: 'transaction-list',
    templateUrl: './transaction-list.component.html',
    imports: [
        TableModule,
        CurrencyPipe,
        Tag,
        StyleClass,
        NgIf
    ],
    styleUrl: './transaction-list.component.less'
})
export class TransactionListComponent {

    @Input()
    transactions!: BankTransaction[];

    constructor() {
    }

}
