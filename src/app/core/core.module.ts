import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfigurationRestService, ConfigurationRestServiceImpl} from "./configuration/rest/configuration-rest.service";
import {RouterModule} from "@angular/router";
import {CategoryScreenComponent} from "./category/category-screen/category-screen.component";
import {CategoryRestService, CategoryRestServiceImpl} from "./category/rest/category-rest.service";

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: 'categories', component: CategoryScreenComponent},
        ])
    ],
    providers: [
        {provide: ConfigurationRestService, useClass: ConfigurationRestServiceImpl},
        {provide: CategoryRestService, useClass: CategoryRestServiceImpl}
    ]

})
export class CoreModule {
}
