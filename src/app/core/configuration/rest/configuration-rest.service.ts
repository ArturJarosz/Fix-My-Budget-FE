import {catchError, Observable, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ApplicationConfiguration, FileResponse} from "../../../models/models";
import {environment} from "../../../../environments/environment";

export abstract class ConfigurationRestService {
    abstract getConfiguration(): Observable<ApplicationConfiguration>;
}

@Injectable()
export class ConfigurationRestServiceImpl implements ConfigurationRestService {
    private getConfigurationUrl = `${environment.apiUrl}/api/configuration`;

    constructor(private httpClient: HttpClient) {
    }


    getConfiguration(): Observable<ApplicationConfiguration> {
        return this.httpClient.get<ApplicationConfiguration>(this.getConfigurationUrl)
            .pipe(
                catchError(error => throwError("Error getting configuration " + error)),
            );
    }

}
