import {patchState, signalStore, withComputed, withMethods, withState} from "@ngrx/signals";
import {CategoryRestService} from "../rest/category-rest.service";
import {computed, inject} from "@angular/core";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {CategoriesByBank, Category} from "../../../models/models";
import {pipe, switchMap, tap} from "rxjs";
import {TransactionStore} from "../../transaction/state/transaction.state";

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
    withMethods((store, restService = inject(CategoryRestService), transactionStore = inject(TransactionStore)) => {
        // shared helper: returns an observable that loads and patches categories
        const reloadCategories$ = () =>
            restService.getCategories()
                .pipe(
                    tap(categoriesFromBackend => {
                        patchState(store, {categories: categoriesFromBackend});
                    })
                );
        return {
            uploadFile: rxMethod<{ file: File }>(
                pipe(
                    switchMap(({file}) =>
                        restService.uploadCategoriesFile(file)
                            .pipe(
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
                    switchMap(({category}) =>
                        restService.createCategory(category)
                            .pipe(
                                // after creation, reload categories
                                switchMap(() => {
                                    transactionStore.loadTransactions({});
                                    return reloadCategories$()
                                })
                            )
                    )
                )
            ),
            updateCategory: rxMethod<{ category: Category }>(
                pipe(
                    switchMap(({category}) =>
                        restService.updateCategory(category.id!, category)
                            .pipe(
                                // after update, reload categories
                                switchMap(() => {
                                    transactionStore.loadTransactions({});
                                    return reloadCategories$()
                                })
                            )
                    )
                )
            ),
            removeCategory: rxMethod<{ categoryId: number }>(
                pipe(
                    switchMap(({categoryId}) =>
                        restService.removeCategory(categoryId)
                            .pipe(
                                switchMap(() => {
                                    transactionStore.loadTransactions({});
                                    return reloadCategories$()
                                })
                            )
                    )
                )
            )
        };
    })
);
