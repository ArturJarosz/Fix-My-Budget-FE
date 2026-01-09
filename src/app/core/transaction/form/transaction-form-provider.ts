import {Injectable} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class TransactionFormProvider {

    constructor(private formBuilder: FormBuilder) {
    }

    public getOverrideTransactionCategoryForm(): FormGroup<TransactionCategoryOverrideForm> {
        return this.formBuilder.group({
            categoryName: this.formBuilder.nonNullable.control('', Validators.required),
            override: this.formBuilder.nonNullable.control(false, Validators.required),
            details: this.formBuilder.nonNullable.control('', Validators.required),
            amount: this.formBuilder.nonNullable.control(0, Validators.required),
            sender: this.formBuilder.nonNullable.control('', Validators.required),
            recipient: this.formBuilder.nonNullable.control('', Validators.required),
        });
    }
}

export interface TransactionCategoryOverrideForm {
    categoryName: FormControl<string>;
    override: FormControl<boolean>;
    details: FormControl<string>;
    amount: FormControl<number>;
    sender: FormControl<string>;
    recipient: FormControl<string>;
};
