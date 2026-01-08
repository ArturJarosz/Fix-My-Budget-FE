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
                        categoriesFromBackend.forEach(category => {
                            category.fontColor = resolveFontColor(category.color);
                        });
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
                                switchMap(() => {
                                        transactionStore.loadTransactionsSummary({});
                                        return reloadCategories$()
                                    }
                                )
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
                                    transactionStore.loadTransactionsSummary({});
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
                                    transactionStore.loadTransactionsSummary({});
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
                                    transactionStore.loadTransactionsSummary({});
                                    return reloadCategories$()
                                })
                            )
                    )
                )
            )
        };
    })
);

function resolveFontColor(bgColor: string | null | undefined): string {
    if (!bgColor) {
        return '#000000';
    }

    // normalize: remove '#', handle short form if needed
    let hex = bgColor.replace('#', '')
        .trim();
    if (hex.length === 3) {
        // e.g. 'abc' -> 'aabbcc'
        hex = hex.split('')
            .map(ch => ch + ch)
            .join('');
    }
    if (hex.length !== 6) {
        return '#000000';
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // relative luminance (sRGB)
    const [rl, gl, bl] = [r, g, b].map(c => {
        const channel = c / 255;
        return channel <= 0.03928
            ? channel / 12.92
            : Math.pow((channel + 0.055) / 1.055, 2.4);
    });

    const luminance = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;

    // threshold: if too dark, use white; otherwise black
    return luminance < 0.5 ? '#FFFFFF' : '#000000';
}
