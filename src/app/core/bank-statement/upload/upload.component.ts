import {Component, inject, OnInit, Signal} from '@angular/core';
import {FileSelectEvent, FileUploadEvent} from "primeng/fileupload";
import {BankStatementRestService} from "../rest/bank-statement-rest.service";
import {FormGroup} from "@angular/forms";
import {BankStatementFormProvider, UpdateBankStatementForm} from "../form/bank-statement-form-provider";
import {BankStatementStore} from "../state/bank-statement.state";
import {ConfigurationStore} from "../../configuration/state/configuration.state";

@Component({
    selector: 'upload',
    templateUrl: './upload.component.html',
    styleUrl: './upload.component.css',
    standalone: false
})
export class UploadComponent implements OnInit {
    uploadForm!: FormGroup<UpdateBankStatementForm>;
    file: File | null = null;

    bankStatementStore = inject(BankStatementStore);
    configurationStore = inject(ConfigurationStore);

    $banks: Signal<string[]> = this.configurationStore.banks;

    constructor(private bankStatementRestService: BankStatementRestService,
                private bankStatementFormProvider: BankStatementFormProvider) {
    }

    ngOnInit(): void {
        this.initUploadForm();
        this.configurationStore.loadConfiguration({});
    }

    initUploadForm(): void {
        this.uploadForm = this.bankStatementFormProvider.getUpdateBankStatementForm();
    }

    protected onUpload($event: FileUploadEvent) {
        console.log($event.files.length);
        if ($event.files.length > 0) {
            const uploadBankStatement = {
                file: $event.files[0],
                bank: this.uploadForm.get('bank')?.value!,
                source: this.uploadForm.get('source')?.value!
            };
            this.bankStatementStore.uploadFile({uploadDtoForm: uploadBankStatement})
            this.initUploadForm();
        }
    }

    isUploadValid(): boolean {
        return this.uploadForm.valid && this.uploadForm.get('bank')?.value !== '' && this.uploadForm.get(
            'source')?.value !== '' && this.file !== null;
    }

    protected assignFile($event: FileSelectEvent) {
        this.file = $event.files[0];
    }
}
