import {Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Dialog} from "primeng/dialog";
import {PrimeTemplate} from "primeng/api";
import {CategoryFormProvider} from "../form/category-form-provider";
import {Category, CategoryIgnoreStatus} from "../../../models/models";
import {ReactiveFormsModule} from "@angular/forms";
import {Fieldset} from "primeng/fieldset";
import {InputSwitch} from "primeng/inputswitch";
import {Button} from "primeng/button";
import {CategoryStore} from "../state/category.state";

@Component({
    selector: 'edit-ignore-status',
    imports: [
        Dialog,
        PrimeTemplate,
        ReactiveFormsModule,
        Fieldset,
        InputSwitch,
        Button
    ],
    templateUrl: './edit-ignore-status.component.html',
    styleUrl: './edit-ignore-status.component.css'
})
export class EditIgnoreStatusComponent implements OnChanges {
    @Input()
    visible = false;
    @Input()
    category!: Category;

    categoryStore = inject(CategoryStore);

    editIgnoreStatusForm = this.categoryFormProvider.createEditOverrideCategoryForm();
    ignoreBank!: boolean;
    ignoreSummary!: boolean;

    constructor(private categoryFormProvider: CategoryFormProvider) {
    }

    @Output()
    notify: EventEmitter<boolean> = new EventEmitter<boolean>();

    ngOnChanges(changes: SimpleChanges): void {
        if (this.category) {
            this.fillFormFromCategory(this.category);
            this.ignoreSummary = this.category.ignoreInSummary;
            this.ignoreBank = this.category.ignoreInBank;
        }
    }

    private fillFormFromCategory(category: Category) {
        this.editIgnoreStatusForm = this.categoryFormProvider.createEditOverrideCategoryForm()

        this.editIgnoreStatusForm.patchValue({
            id: category.id,
            name: category.name,
            bankName: category.bankName,
            ignoreInBank: category.ignoreInBank,
            ignoreInSummary: category.ignoreInSummary
        });
    }

    protected onClose() {
        this.notify.emit(false);
    }

    protected onSave() {
        let ignoreDto: CategoryIgnoreStatus = {
            ignoreBank: this.editIgnoreStatusForm.getRawValue().ignoreInBank,
            ignoreSummary: this.editIgnoreStatusForm.getRawValue().ignoreInSummary
        }
        this.categoryStore.updateIgnoreStatus({
            categoryId: this.category.id!,
            ignoreStatus: ignoreDto});
        this.visible = false;
    }

    protected isSaveEnabled(): boolean {
        let value = this.editIgnoreStatusForm.getRawValue();
        return this.ignoreBank != value.ignoreInBank || this.ignoreSummary != value.ignoreInSummary;
    }
}
