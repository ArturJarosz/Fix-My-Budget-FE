import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {map, Observable} from "rxjs";
import {Category, FileResponse} from "../../../models/models";
import {Injectable} from "@angular/core";

export abstract class CategoryRestService {
    abstract getCategoriesFile(): Observable<FileResponse>;

    abstract uploadCategoriesFile(file: File): Observable<any>;

    abstract getCategories(): Observable<Category[]>;

    abstract createCategory(category: Category): Observable<Category>;

    abstract updateCategory(categoryId: number, category: Category): Observable<Category>;
}

@Injectable()
export class CategoryRestServiceImpl implements CategoryRestService {
    private downloadCategoriesUrl = `${environment.apiUrl}/api/categories/download`;
    private uploadCategoriesUrl = `${environment.apiUrl}/api/categories/upload`;
    private categoriesUrl = `${environment.apiUrl}/api/categories`;

    constructor(private httpClient: HttpClient) {
    }

    getCategoriesFile(): Observable<FileResponse> {
        return this.httpClient.get(this.downloadCategoriesUrl, {
            headers: {},
            observe: 'response',
            responseType: 'blob' as 'json'
        })
            .pipe(
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

    uploadCategoriesFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.httpClient.post(this.uploadCategoriesUrl, formData);
    }

    getCategories(): Observable<Category[]> {
        return this.httpClient.get<Category[]>(this.categoriesUrl);
    }

    createCategory(category: Category): Observable<Category> {
        return this.httpClient.post<Category>(this.categoriesUrl, category);
    }

    updateCategory(categoryId: number, category: Category): Observable<Category> {
        return this.httpClient.post<Category>(`${this.categoriesUrl}/${categoryId}`, category);
    }

    private getFileName(header: string): string {
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
