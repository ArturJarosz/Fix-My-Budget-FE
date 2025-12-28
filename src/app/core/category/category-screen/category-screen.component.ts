import {Component, computed, effect, inject, OnInit, Signal} from '@angular/core';
import {Button, ButtonDirective, ButtonLabel} from "primeng/button";
import {FileUpload, FileUploadEvent} from "primeng/fileupload";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CategoryRestService} from "../rest/category-rest.service";
import {CategoryStore} from "../state/category.state";
import {
    CategoriesByBank,
    Category,
    CategoryNode,
    CategoryRequirement,
    CategoryRequirementValue
} from "../../../models/models";
import {TreeTableModule} from "primeng/treetable";
import {TreeNode} from "primeng/api";
import {TableModule} from "primeng/table";
import {CategoryListComponent} from "../category-list/category-list.component";
import {AddCategoryComponent} from "../add-category/add-category.component";
import {ConfigurationStore} from "../../configuration/state/configuration.state";

@Component({
    selector: 'app-category-screen',
    imports: [
        Button,
        ButtonDirective,
        ButtonLabel,
        FileUpload,
        FormsModule,
        ReactiveFormsModule,
        TreeTableModule,
        TableModule,
        CategoryListComponent,
        AddCategoryComponent
    ],
    templateUrl: './category-screen.component.html',
    styleUrl: './category-screen.component.css'
})
export class CategoryScreenComponent implements OnInit {
    showAddCategoryDialog = false;

    categoryStore = inject(CategoryStore);
    configurationStore = inject(ConfigurationStore);

    $categories: Signal<Category[]> = this.categoryStore.categories;
    $categoriesByBank: Signal<CategoriesByBank> = computed(() => {
        const cats = this.$categories();
        console.log('Recomputing $categoriesByBank, len:', cats.length);

        return cats.reduce<CategoriesByBank>((acc, category) => {
            const bank = category.bankName;
            if (!acc[bank]) {
                acc[bank] = [];
            }
            acc[bank].push(category);
            return acc;
        }, {} as CategoriesByBank);
    });
    $banks: Signal<string[]> = this.configurationStore.banks;
    $fieldTypes: Signal<string[]> = this.configurationStore.fieldTypes;
    $matchTypes: Signal<string[]> = this.configurationStore.matchTypes;

    categories: TreeNode<CategoryNode>[] | undefined;

    constructor(private categoryRestService: CategoryRestService) {
        this.categoryStore.loadCategories({});
        effect(() => {
            const cats = this.$categories();
            console.log('Screen $categories length:', cats.length);
            console.log("refreshing categories...")
            this.categories = this.initTree(cats);
        });

        effect(() => {
            const byBank = this.$categoriesByBank();
            console.log('Screen $categoriesByBank keys:', Object.keys(byBank));
        });
    }

    ngOnInit(): void {
        this.categoryStore.loadCategories({});
        this.configurationStore.loadConfiguration({});
        this.categories = this.initTree(this.$categories());
    }

    protected downloadConfiguration() {
        this.categoryRestService.getCategoriesFile()
            .subscribe((blob) => {
                console.log(blob.fileName);
                const url = window.URL.createObjectURL(blob.blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = blob.fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            });
    }

    protected onUpload($event: FileUploadEvent) {
        if ($event.files.length > 0) {
            const uploadFile = $event.files[0];
            this.categoryStore.uploadFile({file: uploadFile});
        }
    }

    private initTree(categories: Category[]): TreeNode<CategoryNode>[] {
        let result: TreeNode<CategoryNode>[] = [];
        categories.forEach(category => {
            let children = category.requirements.map(requirement => this.mapRequirement(requirement));
            let rootNode: TreeNode<CategoryNode> = {
                data: {
                    name: category.name,
                    bankName: category.bankName
                },
                children: children
            }
            result.push(rootNode);
        })
        return result;
    }

    private mapRequirement(requirement: CategoryRequirement): TreeNode<CategoryNode> {
        let children = requirement.values.map(value => this.mapValue(value));
        return {
            data: requirement,
            children: children
        }
    }

    private mapValue(value: CategoryRequirementValue): TreeNode<CategoryNode> {
        return {data: value}
    }

    protected toggleShowAddCategoryDialog() {
        this.showAddCategoryDialog = !this.showAddCategoryDialog;
    }

    protected onNotify($event: boolean) {
        this.showAddCategoryDialog = $event.valueOf();
    }
}
