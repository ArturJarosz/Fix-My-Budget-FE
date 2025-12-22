import {Component} from '@angular/core';
import {Button, ButtonDirective, ButtonLabel} from "primeng/button";
import {ConfigurationRestService} from "../../configuration/rest/configuration-rest.service";

@Component({
    selector: 'app-category-screen',
    imports: [
        Button,
        ButtonDirective,
        ButtonLabel
    ],
    templateUrl: './category-screen.component.html',
    styleUrl: './category-screen.component.css'
})
export class CategoryScreenComponent {

    constructor(private configurationRestService: ConfigurationRestService) {
    }

    protected downloadConfiguration() {
        this.configurationRestService.getConfigurationFile().subscribe((blob) => {
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
}
