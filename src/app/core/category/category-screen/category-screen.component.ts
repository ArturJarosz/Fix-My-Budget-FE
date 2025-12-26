import {Component, effect, inject, OnInit, Signal} from '@angular/core';
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
        CategoryListComponent
    ],
    templateUrl: './category-screen.component.html',
    styleUrl: './category-screen.component.css'
})
export class CategoryScreenComponent implements OnInit {
    categoryStore = inject(CategoryStore);

    $categories: Signal<Category[]> = this.categoryStore.categories;
    $categoriesByBank: Signal<CategoriesByBank> = this.categoryStore.categoriesByBanks;

    categories: TreeNode<CategoryNode>[] | undefined;


    // test
    banks = [
        {
            name: 'Alior',
            value: 0,
            children: [
                {
                    name: "jedzenie na miescie",
                    type: "CONTAINS",
                    field: "description",
                    values: ["mcdonals", "KFC", "kebab"]
                }
            ]
        },
        {
            name: 'ING',
            value: 1,
            children: [
                {
                    name: "jedzenie na miescie",
                    type: "CONTAINS",
                    field: "description",
                    values: ["mcdonals", "KFC", "kebab"]
                }
            ]
        },
        {
            name: 'Santander',
            value: 2,
            children: [
                {
                    name: "jedzenie na miescie",
                    type: "CONTAINS",
                    field: "description",
                    values: ["mcdonals", "KFC", "kebab"]
                }
            ]
        }];

    constructor(private categoryRestService: CategoryRestService) {
        effect(() => {
            this.categories = this.initTree(this.$categories());
        });
    }

    ngOnInit(): void {
        this.categoryStore.loadCategories({});
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


    protected readonly JSON = JSON;
}
