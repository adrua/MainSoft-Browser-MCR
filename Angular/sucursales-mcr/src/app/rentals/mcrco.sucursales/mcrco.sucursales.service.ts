import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { McrcoSucursalesModel } from './mcrco.sucursales.model';

@Injectable({ providedIn: 'root' })
export class McrcoSucursalesService {
    private baseODataUrl = '';  // URL to web api
    private mcrcoSucursalesODataUrl = '';  // URL to web api
    private mcrcoSucursalesUrl = '';  // URL to web api

    get odataRoute(): string {
        let _mode = this.production ? 'prod' : 'test';
        return `odata/${_mode}-638439352758685202`;
    }

    constructor(private http: HttpClient,
                @Inject('dataBrowserServiceUrl') private dataBrowserServiceUrl: string,
                @Inject('production') private production: boolean) {
        this.baseODataUrl = `${this.dataBrowserServiceUrl}/${this.odataRoute}`;
        this.mcrcoSucursalesODataUrl = `${this.baseODataUrl}/McrcoSucursales`;
        this.mcrcoSucursalesUrl = `${this.dataBrowserServiceUrl}/McrcoSucursales`;
    }

    getById(mcrcoSucursalesId: number): Observable<any> {
        const sUrl = `${this.mcrcoSucursalesODataUrl}(McrcoSucursalesId=${mcrcoSucursalesId})`;

        return this.http.get<any>(sUrl).pipe(
            retry(3),
            tap(() => this.log("fetched McrcoSucursales")),
            catchError((error) => this.handleError("getMcrcoSucursales", error))
        );
    }

    getAll(): Observable<any> {
        const params: any = {};

        params.$expand = "CntCiudades";

        return this.http.get<any>(this.mcrcoSucursalesODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log('fetched McrcoSucursales')),
            catchError((error) => this.handleError('getMcrcoSucursalesList', error))
        );
    }

    getList(filter: string,
            paginator: MatPaginator,
            sort: MatSort): Observable<any> {

        const params: any = {};

        if (filter) {
            params.$filter = filter;
        }

        if (paginator.pageIndex) {
            params.$skip = paginator.pageSize * paginator.pageIndex;
        }

        params.$top = paginator.pageSize;

        if (sort.active) {
            params.$orderby = `${sort.active || ""} ${sort.direction || ""}`;
        }

        params.$count = "true";

        params.$expand = "CntCiudades";

        return this.http.get<any>(this.mcrcoSucursalesODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log("fetched McrcoSucursales")),
            catchError((error) => this.handleError('getMcrcoSucursalesList', error))
        );
    }

    add(row: McrcoSucursalesModel): Observable<McrcoSucursalesModel> {
        return this.http.post<McrcoSucursalesModel>(this.mcrcoSucursalesODataUrl, McrcoSucursalesModel.clone(row)).pipe(
            retry(3),
            tap((_row: McrcoSucursalesModel) => this.log(`added McrcoSucursales w/ id=${_row.McrcoSucursalesId}`)),
            catchError((error) => this.handleError("addMcrcoSucursales", error))
        );
    }

    update(row: McrcoSucursalesModel, original: McrcoSucursalesModel): Observable<McrcoSucursalesModel> {
        const sUrl = `${this.mcrcoSucursalesODataUrl}?keyMcrcoSucursalesId=${original.McrcoSucursalesId}`;

        let changes = <any>{};
        let _current = McrcoSucursalesModel.clone(row);

        for(var key in _current) {
            if(original[key] !== _current[key]) {
                changes[key] = _current[key];
            }
        }

        return this.http.patch<McrcoSucursalesModel>(sUrl, changes).pipe(
            retry(3),
            tap(_ => this.log(`update McrcoSucursales id=${row.McrcoSucursalesId}`)),
            catchError((error) => this.handleError("updateMcrcoSucursales", error))
        );
    }

    save(row: McrcoSucursalesModel, original: McrcoSucursalesModel): Observable<McrcoSucursalesModel> {
        if (row._estado === "N") {
            return this.add(row);
        } else {
            return this.update(row, original);
        }
    }

    delete(original: McrcoSucursalesModel): Observable<any> {
        const sUrl = `${this.mcrcoSucursalesODataUrl}?keyMcrcoSucursalesId=${original.McrcoSucursalesId}`;

        return this.http.delete(sUrl).pipe(
            retry(3),
            tap(_ => this.log(`filter McrcoSucursales id=${original.McrcoSucursalesId}`)),
            catchError((error) => this.handleError("deleteMcrcoSucursales", error))
        );
    }

    saveRows(rows: Array<McrcoSucursalesModel>): Observable<any> {
        const _rows = rows.map((row) => McrcoSucursalesModel.clone(row));
        return this.http.post<any>(this.mcrcoSucursalesUrl, _rows).pipe(
            retry(3),
            tap((rrows: McrcoSucursalesModel) => this.log(`pasted rows in McrcoSucursales `)),
            catchError((error) => this.handleError("addMcrcoSucursales", error))
        );
    }

    batch(row: McrcoSucursalesModel, detailRows: Array<any>): Observable<any> {
        if (detailRows.length) {
            detailRows.forEach((detailRow) => {
                detailRow.body.McrcoSucursalesId = row.McrcoSucursalesId;

            });

            return this.http.post<any>(`${this.dataBrowserServiceUrl}/odata/v1/$batch`,  { requests: detailRows }).pipe(
                retry(3),
                tap((rrows: McrcoSucursalesModel) => this.log(`executed batch in McrcoSucursales `)),
                catchError((error) => this.handleError("BatchMcrcoSucursales", error))
            );
        } else {
            return of({});
        }
    }

    filterCiudadNombreCiudad(val: string, pageSize: number = 10): Observable<any> {
        const sUrl = `${this.baseODataUrl}/CntCiudades`;

        const params: any = { };
        params.$filter = `contains(CiudadNombreCiudad,'${val}')`;
        params.$top = pageSize;

        return this.http.get<any>(sUrl, {params: params}).pipe(
            retry(3),
            tap(_ => this.log(`filter CiudadNombreCiudad id=${val}`)),
            catchError((error) => this.handleError("filterCiudadNombreCiudad", error))
        );
    }

    getByIdCiudadNombreCiudad(ciudadDepartamentoId: number, ciudadid: number): Observable<any> {
        const sUrl = `${this.baseODataUrl}/CntCiudades(CiudadDepartamentoId=${ciudadDepartamentoId}, Ciudadid=${ciudadid})`;

        return this.http.get<any>(sUrl, { }).pipe(
            retry(3),
            tap(_ => this.log(`getById CiudadNombreCiudad CiudadDepartamentoId=${ciudadDepartamentoId}, Ciudadid=${ciudadid}`)),
            catchError((error) => this.handleError("getByIdCiudadNombreCiudad", error))
        );
    }

    private handleError(operation = "operation", result?: any) {

          // TODO: send the error to remote logging infrastructure
          console.error(result.message); // log to console instead

          // TODO: better job of transforming error for user consumption
          this.log(`${operation} failed: ${result.message}`);

          // Let the app keep running by returning an empty result.
          return of(result);
    }

    /** Log a McrcoSucursalesService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`McrcoSucursalesService: ${message}`);
        console.log(`McrcoSucursalesService: ${message}`);
    }
}
