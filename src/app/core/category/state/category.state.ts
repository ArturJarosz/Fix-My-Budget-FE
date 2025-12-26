import {patchState, signalStore, withComputed, withMethods, withState} from "@ngrx/signals";
import {CategoryRestService} from "../rest/category-rest.service";
import {computed, inject} from "@angular/core";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {CategoriesByBank, Category, UploadBankStatement} from "../../../models/models";
import {pipe, switchMap, tap} from "rxjs";

export interface CategoryState {
    categoriesNeedToBeRefreshed: boolean;
    categories: Category[];
    categoriesByBanks: CategoriesByBank;
}

export const initialState: CategoryState = {
    categoriesNeedToBeRefreshed: true,
    categories: [],
    categoriesByBanks: {}
}

export const CategoryStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withComputed(({categories}) => ({
        categoriesByBanks: computed(() => {
            return categories().reduce<CategoriesByBank>((acc, category) => {
                const bank = category.bankName;
                if (!acc[bank]) {
                    acc[bank] = [];
                }
                acc[bank].push(category);
                return acc;
            }, {});
        })
    })),
    withMethods((store, restService = inject(CategoryRestService)) => ({
        uploadFile: rxMethod<{ file: File }>(
            pipe(
                switchMap((file) => {
                    return restService.uploadCategoriesFile(file.file)
                        .pipe(
                            tap(bankTransactions => {
                                patchState(store, {categoriesNeedToBeRefreshed: true})
                            })
                        );
                })
            )
        ),
        loadCategories: rxMethod(() => {
            return restService.getCategories()
                .pipe(
                    tap(categories => {
                        patchState(store, {categoriesNeedToBeRefreshed: false, categories: categories})
                    })
                )
        })
    })));
