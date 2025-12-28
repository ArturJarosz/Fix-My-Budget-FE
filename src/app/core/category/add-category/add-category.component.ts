import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Dialog} from "primeng/dialog";
import {
    AddCategoryForm,
    CategoryFormProvider,
    CategoryRequirementFormGroup,
    CategoryRequirementValueFormGroup
} from "../form/category-form-provider";
import {FormArray, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {Fieldset} from "primeng/fieldset";
import {Button} from "primeng/button";
import {ColorPickerModule} from "primeng/colorpicker";
import {Category, CategoryRequirement, CategoryRequirementValue} from "../../../models/models";
import {CategoryStore} from "../state/category.state";

@Component({
    selector: 'add-category',
    imports: [
        ReactiveFormsModule,
        InputText,
        DropdownModule,
        Dialog,
        NgClass,
        NgIf,
        NgForOf,
        Fieldset,
        Button,
        ColorPickerModule

    ],
    templateUrl: './add-category.component.html',
    styleUrl: './add-category.component.css'
})
export class AddCategoryComponent implements OnInit {
    @Input()
    visible = false;
    @Input()
    banks!: string[];
    @Input()
    fieldTypes!: string[];
    @Input()
    matchTypes!: string[];
    @Output()
    notify: EventEmitter<boolean> = new EventEmitter<boolean>();

    addCategoryForm: FormGroup<AddCategoryForm> = this.categoryFormProvider.getAddCategoryForm();

    categoryStore = inject(CategoryStore);

    constructor(private categoryFormProvider: CategoryFormProvider) {
    }

    ngOnInit(): void {
        this.initAddForm();
    }

    initAddForm() {
        this.addCategoryForm = this.categoryFormProvider.getAddCategoryForm();
        // Initialize empty requirements array
        this.addCategoryForm.get('requirements')
            ?.setValue([]);
        this.requirementsControl.clear();
    }

    // Convenience getter for requirements control & value
    get requirementsControl(): FormArray<CategoryRequirementFormGroup> {
        return this.addCategoryForm.controls.requirements;
    }

    requirementValuesControl(index: number): FormArray<CategoryRequirementValueFormGroup> {
        return this.requirementsControl.at(index).controls.values;
    }

    get requirements() {
        return (this.requirementsControl?.value as any[]) || [];
    }


    addRequirement() {
        const newRequirement = this.categoryFormProvider.createRequirement({
            fieldType: this.fieldTypes?.[0] ?? '',
            matchType: this.matchTypes?.[0] ?? ''
        });
        this.requirementsControl.push(newRequirement);
        this.requirementsControl.markAsDirty();
    }

    removeRequirement(index: number) {
        this.requirementsControl.removeAt(index);
        this.requirementsControl.markAsDirty();
    }

    onFieldTypeChange(index: number, value: string) {
        const requirement = this.requirementsControl.at(index);
        requirement.controls.fieldType.setValue(value);
        requirement.markAsDirty();
    }

    onMatchTypeChange(index: number, value: string) {
        const requirement = this.requirementsControl.at(index);
        requirement.controls.matchType.setValue(value);
        requirement.markAsDirty();
    }

    addRequirementValue(reqIndex: number, value: string) {
        const trimmed = (value ?? '').trim();
        if (!trimmed) {
            return;
        }
        const valuesArray = this.requirementValuesControl(reqIndex);
        valuesArray.push(this.categoryFormProvider.createRequirementValue({ value: trimmed }));
        valuesArray.markAsDirty();
    }

    removeRequirementValue(reqIndex: number, valueIndex: number) {
        const valuesArray = this.requirementValuesControl(reqIndex);
        valuesArray.removeAt(valueIndex);
        valuesArray.markAsDirty();
    }

    protected onClose() {
        this.notify.emit(false);
    }

    onSave() {
        if (this.addCategoryForm.invalid || !this.isDataCorrect()) {
            this.addCategoryForm.markAllAsTouched();
            return;
        }

        const formValue = this.addCategoryForm.getRawValue();

        const category: Category = {
            name: formValue.name,
            bankName: formValue.bankName,
            color: formValue.color,
            requirements: (formValue.requirements ?? []).map(req => {
                const requirement: CategoryRequirement = {
                    fieldType: req.fieldType,
                    matchType: req.matchType,
                    values: (req.values ?? []).map(v => {
                        const value: CategoryRequirementValue = {
                            value: v.value
                        };
                        return value;
                    })
                };
                return requirement;
            })
        };

        console.log(JSON.stringify(category));

        this.categoryStore.createCategory({category});

        this.visible = false;
        this.initAddForm();
    }

    isDataCorrect(): boolean {
        let notEmptyRequirements = this.requirementsControl.length > 0;
        let notEmptyValues = this.requirementsControl.controls.every(req => req.controls.values.length > 0);
        let basicDataValid = this.addCategoryForm.controls.name.value.trim().length > 0 && this.addCategoryForm.controls.bankName.value.trim().length > 0;
        return notEmptyRequirements && notEmptyValues && basicDataValid;
    }

    protected readonly JSON = JSON;

}
