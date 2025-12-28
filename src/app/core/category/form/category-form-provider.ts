import {Injectable} from "@angular/core";
import {CategoryRequirement, CategoryRequirementValue} from "../../../models/models";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class CategoryFormProvider {

    constructor(private formBuilder: FormBuilder) {
    }

    public getAddCategoryForm(): FormGroup<AddCategoryForm> {
        return this.formBuilder.nonNullable.group<AddCategoryForm>({
            name: this.formBuilder.nonNullable.control<string>(''),
            bankName: this.formBuilder.nonNullable.control<string>(''),
            color: this.formBuilder.nonNullable.control<string>('#000000'),
            requirements: this.formBuilder.nonNullable.array<CategoryRequirementFormGroup>([])
        });
    }

    public createRequirement(requirement?: Partial<CategoryRequirement>): CategoryRequirementFormGroup {
        return this.formBuilder.nonNullable.group({
            fieldType: this.formBuilder.nonNullable.control<string>(requirement?.fieldType ?? ''),
            matchType: this.formBuilder.nonNullable.control<string>(requirement?.matchType ?? ''),
            values: this.formBuilder.nonNullable.array<CategoryRequirementValueFormGroup>(
                (requirement?.values ?? []).map(v => this.createRequirementValue(v))
            )
        });
    }

    public createRequirementValue(value?: Partial<CategoryRequirementValue>): CategoryRequirementValueFormGroup {
        return this.formBuilder.nonNullable.group({
            value: this.formBuilder.nonNullable.control<string>(value?.value ?? '')
        });
    }
}

export interface AddCategoryForm {
    name: FormControl<string>;
    bankName: FormControl<string>;
    color: FormControl<string>;
    requirements: FormArray<CategoryRequirementFormGroup>;
}

export type CategoryRequirementFormGroup = FormGroup<{
    fieldType: FormControl<string>;
    matchType: FormControl<string>;
    values: FormArray<CategoryRequirementValueFormGroup>;
}>;


export type CategoryRequirementValueFormGroup = FormGroup<{
    value: FormControl<string>;
}>;
