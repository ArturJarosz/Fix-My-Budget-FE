import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfigurationRestService, ConfigurationRestServiceImpl} from "./configuration/rest/configuration-rest.service";

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    providers: [
        {provide: ConfigurationRestService, useClass: ConfigurationRestServiceImpl}
    ]

})
export class CoreModule {
}
