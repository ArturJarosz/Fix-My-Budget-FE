import {patchState, signalStore, withComputed, withMethods, withState} from "@ngrx/signals";
import {CategoryRestService} from "../rest/category-rest.service";
import {computed, inject} from "@angular/core";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {CategoriesByBank, Category} from "../../../models/models";
import {pipe, switchMap, tap} from "rxjs";

export interface CategoryState {
    categories: Category[];
}

export const initialState: CategoryState = {
    categories: [],
};

export const CategoryStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withComputed((store) => ({
        categoriesByBanks: computed(() => {
            const cats = store.categories();
            return cats.reduce<CategoriesByBank>((acc, category) => {
                const bank = category.bankName;
                if (!acc[bank]) {
                    acc[bank] = [];
                }
                acc[bank].push(category);
                return acc;
            }, {} as CategoriesByBank);
        })
    })),
    withMethods((store, restService = inject(CategoryRestService)) => {
        // shared helper: returns an observable that loads and patches categories
        const reloadCategories$ = () =>
            restService.getCategories().pipe(
                tap(categoriesFromBackend => {
                    console.log('Store reloadCategories, len:', categoriesFromBackend.length);
                    patchState(store, { categories: categoriesFromBackend });
                })
            );

        return {
            uploadFile: rxMethod<{ file: File }>(
                pipe(
                    switchMap(({ file }) =>
                        restService.uploadCategoriesFile(file).pipe(
                            // after upload, reload categories
                            switchMap(() => reloadCategories$())
                        )
                    )
                )
            ),

            loadCategories: rxMethod(() => {
                return reloadCategories$();
            }),

            createCategory: rxMethod<{ category: Category }>(
                pipe(
                    switchMap(({ category }) =>
                        restService.createCategory(category).pipe(
                            // after create, reload categories
                            switchMap(() => reloadCategories$())
                        )
                    )
                )
            )
        };
    })
);
