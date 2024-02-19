import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { McrcoAutomovilesModel } from './mcrco.automoviles.model';

@Injectable({ providedIn: 'root' })
export class McrcoAutomovilesService {
    private baseODataUrl = '';  // URL to web api
    private mcrcoAutomovilesODataUrl = '';  // URL to web api
    private mcrcoAutomovilesUrl = '';  // URL to web api

    get odataRoute(): string {
        let _mode = this.production ? 'prod' : 'test';
        return `odata/${_mode}-638439362955454146`;
    }

    constructor(private http: HttpClient,
                @Inject('dataBrowserServiceUrl') private dataBrowserServiceUrl: string,
                @Inject('production') private production: boolean) {
        this.baseODataUrl = `${this.dataBrowserServiceUrl}/${this.odataRoute}`;
        this.mcrcoAutomovilesODataUrl = `${this.baseODataUrl}/McrcoAutomoviles`;
        this.mcrcoAutomovilesUrl = `${this.dataBrowserServiceUrl}/McrcoAutomoviles`;
    }

    getById(mcrcoAutomovilesId: number): Observable<any> {
        const sUrl = `${this.mcrcoAutomovilesODataUrl}(McrcoAutomovilesId=${mcrcoAutomovilesId})`;

        return this.http.get<any>(sUrl).pipe(
            retry(3),
            tap(() => this.log("fetched McrcoAutomoviles")),
            catchError((error) => this.handleError("getMcrcoAutomoviles", error))
        );
    }

    getAll(): Observable<any> {
        const params: any = {};

        params.$expand = "McrcoSucursalesReclamar,McrcoSucursalesEntrega";

        return this.http.get<any>(this.mcrcoAutomovilesODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log('fetched McrcoAutomoviles')),
            catchError((error) => this.handleError('getMcrcoAutomovilesList', error))
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

        params.$expand = "McrcoSucursalesReclamar,McrcoSucursalesEntrega";

        return this.http.get<any>(this.mcrcoAutomovilesODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log("fetched McrcoAutomoviles")),
            catchError((error) => this.handleError('getMcrcoAutomovilesList', error))
        );
    }

    add(row: McrcoAutomovilesModel): Observable<McrcoAutomovilesModel> {
        return this.http.post<McrcoAutomovilesModel>(this.mcrcoAutomovilesODataUrl, McrcoAutomovilesModel.clone(row)).pipe(
            retry(3),
            tap((_row: McrcoAutomovilesModel) => this.log(`added McrcoAutomoviles w/ id=${_row.McrcoAutomovilesId}`)),
            catchError((error) => this.handleError("addMcrcoAutomoviles", error))
        );
    }

    update(row: McrcoAutomovilesModel, original: McrcoAutomovilesModel): Observable<McrcoAutomovilesModel> {
        const sUrl = `${this.mcrcoAutomovilesODataUrl}?keyMcrcoAutomovilesId=${original.McrcoAutomovilesId}`;

        let changes = <any>{};
        let _current = McrcoAutomovilesModel.clone(row);

        for(var key in _current) {
            if(original[key] !== _current[key]) {
                changes[key] = _current[key];
            }
        }

        return this.http.patch<McrcoAutomovilesModel>(sUrl, changes).pipe(
            retry(3),
            tap(_ => this.log(`update McrcoAutomoviles id=${row.McrcoAutomovilesId}`)),
            catchError((error) => this.handleError("updateMcrcoAutomoviles", error))
        );
    }

    save(row: McrcoAutomovilesModel, original: McrcoAutomovilesModel): Observable<McrcoAutomovilesModel> {
        if (row._estado === "N") {
            return this.add(row);
        } else {
            return this.update(row, original);
        }
    }

    delete(original: McrcoAutomovilesModel): Observable<any> {
        const sUrl = `${this.mcrcoAutomovilesODataUrl}?keyMcrcoAutomovilesId=${original.McrcoAutomovilesId}`;

        return this.http.delete(sUrl).pipe(
            retry(3),
            tap(_ => this.log(`filter McrcoAutomoviles id=${original.McrcoAutomovilesId}`)),
            catchError((error) => this.handleError("deleteMcrcoAutomoviles", error))
        );
    }

    saveRows(rows: Array<McrcoAutomovilesModel>): Observable<any> {
        const _rows = rows.map((row) => McrcoAutomovilesModel.clone(row));
        return this.http.post<any>(this.mcrcoAutomovilesUrl, _rows).pipe(
            retry(3),
            tap((rrows: McrcoAutomovilesModel) => this.log(`pasted rows in McrcoAutomoviles `)),
            catchError((error) => this.handleError("addMcrcoAutomoviles", error))
        );
    }

    batch(row: McrcoAutomovilesModel, detailRows: Array<any>): Observable<any> {
        if (detailRows.length) {
            detailRows.forEach((detailRow) => {
                detailRow.body.McrcoAutomovilesId = row.McrcoAutomovilesId;

            });

            return this.http.post<any>(`${this.dataBrowserServiceUrl}/odata/v1/$batch`,  { requests: detailRows }).pipe(
                retry(3),
                tap((rrows: McrcoAutomovilesModel) => this.log(`executed batch in McrcoAutomoviles `)),
                catchError((error) => this.handleError("BatchMcrcoAutomoviles", error))
            );
        } else {
            return of({});
        }
    }

    filterMcrcoSucursalesDescripcionReclamar(val: string, pageSize: number = 10): Observable<any> {
        const sUrl = `${this.baseODataUrl}/McrcoSucursales`;

        const params: any = { };
        params.$filter = `contains(McrcoSucursalesDescripcion,'${val}')`;
        params.$top = pageSize;

        return this.http.get<any>(sUrl, {params: params}).pipe(
            retry(3),
            tap(_ => this.log(`filter McrcoSucursalesDescripcionReclamar id=${val}`)),
            catchError((error) => this.handleError("filterMcrcoSucursalesDescripcionReclamar", error))
        );
    }

    getByIdMcrcoSucursalesDescripcionReclamar(mcrcoSucursalesId: number): Observable<any> {
        const sUrl = `${this.baseODataUrl}/McrcoSucursales(McrcoSucursalesId=${mcrcoSucursalesId})`;

        return this.http.get<any>(sUrl, { }).pipe(
            retry(3),
            tap(_ => this.log(`getById McrcoSucursalesDescripcionReclamar McrcoSucursalesId=${mcrcoSucursalesId}`)),
            catchError((error) => this.handleError("getByIdMcrcoSucursalesDescripcionReclamar", error))
        );
    }

    filterMcrcoSucursalesDescripcionEntrega(val: string, pageSize: number = 10): Observable<any> {
        const sUrl = `${this.baseODataUrl}/McrcoSucursales`;

        const params: any = { };
        params.$filter = `contains(McrcoSucursalesDescripcion,'${val}')`;
        params.$top = pageSize;

        return this.http.get<any>(sUrl, {params: params}).pipe(
            retry(3),
            tap(_ => this.log(`filter McrcoSucursalesDescripcionEntrega id=${val}`)),
            catchError((error) => this.handleError("filterMcrcoSucursalesDescripcionEntrega", error))
        );
    }

    getByIdMcrcoSucursalesDescripcionEntrega(mcrcoSucursalesId: number): Observable<any> {
        const sUrl = `${this.baseODataUrl}/McrcoSucursales(McrcoSucursalesId=${mcrcoSucursalesId})`;

        return this.http.get<any>(sUrl, { }).pipe(
            retry(3),
            tap(_ => this.log(`getById McrcoSucursalesDescripcionEntrega McrcoSucursalesId=${mcrcoSucursalesId}`)),
            catchError((error) => this.handleError("getByIdMcrcoSucursalesDescripcionEntrega", error))
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

    /** Log a McrcoAutomovilesService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`McrcoAutomovilesService: ${message}`);
        console.log(`McrcoAutomovilesService: ${message}`);
    }
}
