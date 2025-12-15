import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TransactionsListComponent} from "./transactions-list/transactions-list.component";

@NgModule({
    declarations: [
        TransactionsListComponent
    ],
    imports: [
        CommonModule
    ]
})
export class TransactionsModule {
}
