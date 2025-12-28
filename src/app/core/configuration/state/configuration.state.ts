import {patchState, signalStore, withMethods, withState} from "@ngrx/signals";
import {inject} from "@angular/core";
import {ConfigurationRestService} from "../rest/configuration-rest.service";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {pipe, switchMap, tap} from "rxjs";

export interface ConfigurationState {
    banks: string[];
    fieldTypes: string[];
    matchTypes: string[];
    configurationLoaded: boolean;
}

export const initialState: ConfigurationState = {
    banks: [],
    configurationLoaded: false,
    fieldTypes: [],
    matchTypes: []
};

export const ConfigurationStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods((store, configurationRestService = inject(ConfigurationRestService)) => ({
        loadConfiguration: rxMethod<{}>(
            pipe(
                switchMap( () => {
                    return configurationRestService.getConfiguration()
                        .pipe(
                            tap(configuration => {
                                patchState(store, {
                                    banks: configuration.banks,
                                    fieldTypes: configuration.fieldTypes,
                                    matchTypes: configuration.matchTypes,
                                    configurationLoaded: true})
                            })
                        )
                    }
                )
            )
        )
    }))
);
