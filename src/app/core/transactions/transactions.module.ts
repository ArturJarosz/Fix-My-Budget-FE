import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TransactionsListComponent} from "./transactions-list/transactions-list.component";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {Tag} from "primeng/tag";
import {RouterModule} from "@angular/router";

@NgModule({
    declarations: [
        TransactionsListComponent
    ],
    exports: [
        TransactionsListComponent
    ],
    imports: [
        CommonModule,
        TableModule,
        Button,
        Tag,
        RouterModule.forChild([
            {path: 'transactions', component: TransactionsListComponent}
        ])
    ]
})
export class TransactionsModule {
}
