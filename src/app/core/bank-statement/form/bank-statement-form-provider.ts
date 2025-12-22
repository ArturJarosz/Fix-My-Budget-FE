import {Injectable} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class BankStatementFormProvider {

    constructor(private formBuilder: FormBuilder) {
    }

    public getUpdateBankStatementForm(): FormGroup<UpdateBankStatementForm> {
        return this.formBuilder.nonNullable.group<UpdateBankStatementForm>({
            bank: this.formBuilder.nonNullable.control<string>(''),
            source: this.formBuilder.nonNullable.control<string>('')
        })
    }
}

export interface UpdateBankStatementForm {
    bank : FormControl<string>,
    source: FormControl<string>
}
