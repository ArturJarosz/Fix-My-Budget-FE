import {Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Button} from "primeng/button";
import {ColorPicker} from "primeng/colorpicker";
import {Dialog} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {Fieldset} from "primeng/fieldset";
import {FormArray, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {
    AddCategoryForm,
    CategoryFormProvider,
    CategoryRequirementFormGroup,
    CategoryRequirementValueFormGroup
} from "../form/category-form-provider";
import {CategoryStore} from "../state/category.state";
import {Category, CategoryRequirement, CategoryRequirementValue} from "../../../models/models";

@Component({
    selector: 'edit-category',
    imports: [
        Button,
        ColorPicker,
        Dialog,
        DropdownModule,
        Fieldset,
        FormsModule,
        InputText,
        NgForOf,
        NgIf,
        PrimeTemplate,
        ReactiveFormsModule,
        NgClass
    ],
    templateUrl: './edit-category.component.html',
    styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent implements OnInit, OnChanges {
    @Input()
    visible = false;
    @Input()
    banks!: string[];
    @Input()
    fieldTypes!: string[];
    @Input()
    matchTypes!: string[];
    @Input()
    category!: Category;
    @Output()
    notify: EventEmitter<boolean> = new EventEmitter<boolean>();

    editCategoryForm: FormGroup<AddCategoryForm> = this.categoryFormProvider.getAddCategoryForm();

    categoryStore = inject(CategoryStore);

    constructor(private categoryFormProvider: CategoryFormProvider) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.category) {
            this.fillFormFromCategory(this.category);
        }
    }

    ngOnInit(): void {
        if (this.category) {
            this.fillFormFromCategory(this.category);
        }
    }

    private fillFormFromCategory(category: Category) {
        // reset the form
        this.editCategoryForm = this.categoryFormProvider.getAddCategoryForm();

        this.editCategoryForm.patchValue({
            name: category.name,
            bankName: category.bankName,
            color: category.color,
            id: category.id
        });

        this.requirementsControl.clear();

        (category.requirements || []).forEach(req => {
            const reqGroup = this.categoryFormProvider.createRequirement({
                fieldType: req.fieldType,
                matchType: req.matchType,
                id: req.id
            });
            const valuesArray = reqGroup.controls.values;
            valuesArray.clear();

            (req.values || []).forEach(v => {
                const valueGroup = this.categoryFormProvider.createRequirementValue({
                    value: v.value,
                    id: v.id
                });
                valuesArray.push(valueGroup);
            });

            this.requirementsControl.push(reqGroup);
        });

        this.editCategoryForm.markAsPristine();
    }

    // Convenience getter for requirements control & value
    get requirementsControl(): FormArray<CategoryRequirementFormGroup> {
        return this.editCategoryForm.controls.requirements;
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
        valuesArray.push(this.categoryFormProvider.createRequirementValue({value: trimmed}));
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
        if (this.editCategoryForm.invalid || !this.isDataCorrect()) {
            this.editCategoryForm.markAllAsTouched();
            return;
        }

        const formValue = this.editCategoryForm.getRawValue();

        const category: Category = {
            name: formValue.name,
            bankName: formValue.bankName,
            color: formValue.color,
            id: formValue.id,
            requirements: (formValue.requirements ?? []).map(req => {
                const requirement: CategoryRequirement = {
                    fieldType: req.fieldType,
                    matchType: req.matchType,
                    id: req.id,
                    values: (req.values ?? []).map(v => {
                        const value: CategoryRequirementValue = {
                            value: v.value,
                            id: v.id
                        };
                        return value;
                    })
                };
                return requirement;
            })
        };

        this.categoryStore.updateCategory({category});
        this.visible = false;
    }

    isDataCorrect(): boolean {
        let notEmptyRequirements = this.requirementsControl.length > 0;
        let notEmptyValues = this.requirementsControl.controls.every(req => req.controls.values.length > 0);
        let basicDataValid = this.editCategoryForm.controls.name.value.trim().length > 0 && this.editCategoryForm.controls.bankName.value.trim().length > 0;
        return notEmptyRequirements && notEmptyValues && basicDataValid;
    }

    protected readonly JSON = JSON;
}
