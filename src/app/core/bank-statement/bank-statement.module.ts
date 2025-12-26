import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {UploadComponent} from "./upload/upload.component";
import {FileUpload} from "primeng/fileupload";
import {Button} from "primeng/button";
import {BankStatementRestService, BankStatementRestServiceImpl} from "./rest/bank-statement-rest.service";
import {DropdownModule} from "primeng/dropdown";
import {ReactiveFormsModule} from "@angular/forms";
import {Select} from "primeng/select";
import {provideAnimations} from "@angular/platform-browser/animations";
import {InputText} from "primeng/inputtext";

@NgModule({
        imports: [
            RouterModule.forChild([
                {path: 'bank-statement/upload', component: UploadComponent}
            ]),
            FileUpload,
            Button,
            DropdownModule,
            ReactiveFormsModule,
            Select,
            InputText
        ],
        providers: [
            {provide: BankStatementRestService, useClass: BankStatementRestServiceImpl},
            provideAnimations()
        ]
    }
)
export class BankStatementModule {

}
