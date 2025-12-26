import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {Tag} from "primeng/tag";
import {RouterModule} from "@angular/router";
import {TransactionScreenComponent} from "./transaction-screen/transaction-screen.component";
import {StyleClass} from "primeng/styleclass";

@NgModule({
    imports: [
        CommonModule,
        TableModule,
        Button,
        Tag,
        RouterModule.forChild([
            {path: 'transactions', component: TransactionScreenComponent}
        ]),
        StyleClass
    ]
})
export class TransactionsModule {
}
