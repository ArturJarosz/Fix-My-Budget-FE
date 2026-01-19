import {Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Dialog} from "primeng/dialog";
import {BankTransaction, BankTransactionCategoryOverride, Category} from "../../../models/models";
import {TransactionCategoryOverrideForm, TransactionFormProvider} from "../form/transaction-form-provider";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TransactionStore} from "../state/transaction.state";
import {PrimeTemplate} from "primeng/api";
import {Select} from "primeng/select";
import {InputSwitch} from "primeng/inputswitch";
import {Button} from "primeng/button";

@Component({
    selector: 'override-transaction-category',
    imports: [
        Dialog,
        PrimeTemplate,
        ReactiveFormsModule,
        Select,
        InputSwitch,
        Button
    ],
    templateUrl: './override-transaction-category.component.html',
    styleUrl: './override-transaction-category.component.css'
})
export class OverrideTransactionCategoryComponent implements OnChanges {
    @Input()
    visible = false;
    @Input()
    categories!: Category[];
    @Input()
    transaction!: BankTransaction;

    UNCATEGORIZED: Category = {
        bankName: "",
        requirements: [],
        name: 'UNCATEGORIZED',
        color: '#808080',
        ignoreInBank: false,
        ignoreInSummary: false,
    }

    overrideCategoryForm: FormGroup<TransactionCategoryOverrideForm> = this.transactionFormProvider.getOverrideTransactionCategoryForm();

    transactionStore = inject(TransactionStore)

    originalTransactionCategory!: string;
    originalOverrideValue!: boolean;

    @Output()
    notify: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private transactionFormProvider: TransactionFormProvider) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.transaction) {
            this.addUncategorized()
            this.fillForm(this.transaction)
            this.originalTransactionCategory = this.transaction.category!
            this.originalOverrideValue = this.transaction.categoryOverridden?this.transaction.categoryOverridden:false;
        }
    }

    addUncategorized() {
        if (!this.categories.find((category) => category.name === this.UNCATEGORIZED.name)) {
            this.categories.push(this.UNCATEGORIZED)
        }
    }

    private fillForm(transaction: BankTransaction) {

        this.overrideCategoryForm.patchValue({
            categoryName: transaction.category,
            override: transaction.categoryOverridden?transaction.categoryOverridden:false,
            details: transaction.details,
            amount: transaction.amount,
            sender: transaction.senderName,
            recipient: transaction.recipientName,
        });
    }

    protected onClose() {
        this.notify.emit(false);
    }

    onSave() {
        let categoryOverride: BankTransactionCategoryOverride = {
            categoryName: this.overrideCategoryForm.value.categoryName!,
            override: this.overrideCategoryForm.value.override!
        }
        this.transactionStore.overrideTransactionCategory(
            {transactionId: this.transaction.id, override: categoryOverride});
        this.visible = false;
    }

    onChangeCategoryEvent() {
        if (this.originalTransactionCategory != this.overrideCategoryForm.controls.categoryName.value) {
            this.overrideCategoryForm.patchValue({override: true})
        } else {
            this.overrideCategoryForm.patchValue({override: false})
        }
    }

    isDataCorrect() {
        if (!this.visible) {
            return;
        }
        return this.overrideCategoryForm.controls.categoryName.value != 'UNCATEGORIZED'
            && (this.overrideCategoryForm.controls.categoryName.value != this.originalTransactionCategory
                || this.overrideCategoryForm.controls.override.value != this.originalOverrideValue);

    }

}
