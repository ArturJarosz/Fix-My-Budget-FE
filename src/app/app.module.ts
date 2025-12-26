import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {providePrimeNG} from "primeng/config"
import Aura from '@primeuix/themes/aura';
import {IconField, IconFieldModule} from "primeng/iconfield";
import {InputIcon, InputIconModule} from "primeng/inputicon";
import {FormsModule} from "@angular/forms";
import {Avatar, AvatarModule} from "primeng/avatar";
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {TransactionsModule} from "./core/transaction/transactions.module";
import { HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import {BankStatementModule} from "./core/bank-statement/bank-statement.module";
import {Tooltip} from "primeng/tooltip";
import {CoreModule} from "./core/core.module";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        IconField,
        InputIcon,
        FormsModule,
        Avatar,
        CommonModule,
        AvatarModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        TransactionsModule,
        BankStatementModule,
        HttpClientModule,
        GraphQLModule,
        Tooltip,
        CoreModule
    ],
    providers: [
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: false
                }
            }
        })
    ]
})
export class AppModule {
}
