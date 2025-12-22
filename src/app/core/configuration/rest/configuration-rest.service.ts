import {catchError, map, Observable, of, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApplicationConfiguration, FileResponse} from "../../../models/models";
import {environment} from "../../../../environments/environment";

export abstract class ConfigurationRestService {
    abstract getConfiguration(): Observable<ApplicationConfiguration>;

    abstract getConfigurationFile(): Observable<FileResponse>;
}

@Injectable()
export class ConfigurationRestServiceImpl implements ConfigurationRestService {
    private getConfigurationUrl = `${environment.apiUrl}/api/configuration`;
    private downloadConfigurationUrl = `${environment.apiUrl}/api/configuration/download`;


    constructor(private httpClient: HttpClient) {
    }

    getConfigurationFile(): Observable<FileResponse> {
        return this.httpClient.get(this.downloadConfigurationUrl, {
            headers: {},
            observe: 'response',
            responseType: 'blob' as 'json'
        }).pipe(
            map(response => {
                const contentDisposition = response.headers.get('Content-Disposition');
                let filename = 'configuration.json';
                if (contentDisposition) {
                    filename = this.getFileName(contentDisposition);
                }
                return {
                    fileName: filename,
                    blob: response.body as Blob
                } as FileResponse;
            })
        );
    }

    getConfiguration(): Observable<ApplicationConfiguration> {
        return this.httpClient.get<ApplicationConfiguration>(this.getConfigurationUrl)
            .pipe(
                catchError(error => throwError("Error getting configuration " + error)),
            );
    }

    getFileName(header: string): string {
        let filename = '';
        if (header && header.indexOf('attachment') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(header);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }
        return filename;
    }
}
