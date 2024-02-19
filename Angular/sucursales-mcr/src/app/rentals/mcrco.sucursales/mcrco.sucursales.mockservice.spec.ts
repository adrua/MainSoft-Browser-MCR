import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { McrcoSucursalesModel } from './mcrco.sucursales.model';

declare var lastError;

@Injectable({ providedIn: 'root' })
export class McrcoSucursalesMockService {
    rows: Array<McrcoSucursalesModel> = [];
    autoincrement = this.rows.length;

    rowsCntCiudades: Array<any> = [{
        CiudadDepartamentoId: 276,
        Ciudadid: 276,
        Cnt: "276",
        CiudadNombreCiudad: "Barranquilla"
    }];

    constructor() { }

    getById(mcrcoSucursalesId: number): Observable<any> {
        const _filtered = this.rows.filter((x) => x.McrcoSucursalesId === mcrcoSucursalesId);

        let _row = <any>{};

        if (_filtered.length) {
            _row = _filtered[0];
        } else {
            _row = {
                status: 404,
                statusText: "OK"
            };
            lastError = _row;
        }
        
        return of(_row);
    }

    getAll(): Observable<any> {
        return of({
            "@odata.count": this.rows.length,
            value: this.rows        
        });
    }

    getList(filter: string,
            paginator: any,
            sort: any): Observable<any> {

        let _filtered = [...this.rows];

        if (filter) {
            const _filter = new Function("x", `return ${filter};`);
            _filtered = this.rows.filter((x) => _filter(x));
        }

        if (sort?.active) {
            const _sort = new Function("a", "b", `return (a.${sort.active.column} === b.${sort.active.column}])?0:((a.${sort.active.column}] > b.${sort.active.column}])?1:-1);`);
            _filtered = _filtered.sort((a, b) => _sort(a, b));
            if(sort.direction === "desc") {
                _filtered = _filtered.reverse();
            }
        }

        _filtered = _filtered.slice(paginator.pageIndex * paginator.pageSize, paginator.pageSize);
        return of({
            "@odata.count": _filtered.length,
            value: _filtered        
        });
    }

    add(row: McrcoSucursalesModel): Observable<McrcoSucursalesModel> {
        let _row = McrcoSucursalesModel.clone(row);
        _row.McrcoSucursalesId = ++this.autoincrement;       

        this.rows.push(_row);
        return of(_row);
    }

    update(row: McrcoSucursalesModel, original: McrcoSucursalesModel): Observable<McrcoSucursalesModel> {
        const inx = this.rows.findIndex((x) => x.McrcoSucursalesId === original.McrcoSucursalesId);

        let _row = null;

        if (inx >= 0) {
            this.rows[inx] = McrcoSucursalesModel.clone(row);
        } else {
            _row = {
                status: 404,
                statusText: "OK"
            };
            lastError = _row;
        }

        return of(_row);
    }

    save(row: McrcoSucursalesModel, original: McrcoSucursalesModel): Observable<McrcoSucursalesModel> {
        if (row._estado === 'N') {
            return this.add(row);
        } else {
            return this.update(row, original);
        }
    }

    delete(row: McrcoSucursalesModel): Observable<any> {
        const inx = this.rows.findIndex((x) => x.McrcoSucursalesId === row.McrcoSucursalesId);

        let _row = null;

        if (inx >= 0) {
            this.rows.splice(inx, 1);
        } else {
            _row = {
                status: 404,
                statusText: "OK"
            };
            lastError = _row;
        }

        return of(_row);
    }

    saveRows(rows: Array<McrcoSucursalesModel>): Observable<any> {
        const _rows = rows.map((row) => this.add(row));
        return of(_rows);
    }

    filterCiudadNombreCiudad(val: string, pageSize: number = 10): Observable<any> {
        let _filtered = this.rowsCntCiudades.filter((x) => x.CiudadNombreCiudad.includes(val)).slice(0, pageSize);
        
        return of(_filtered);
    }

    getByIdCiudadNombreCiudad(ciudadDepartamentoId: number, ciudadid: number): Observable<any> {
        let _filtered = this.rowsCntCiudades.filter((x) => x.CiudadDepartamentoId === ciudadDepartamentoId && x.Ciudadid === ciudadid);

        let _row = null;

        if (_filtered.length) {
            _row = _filtered[0];
        } else {
            _row = {
                status: 404,
                statusText: "OK"
            };
        }

        return of(_row);
    }

    private handleError(operation = 'operation', result?: any) {

          // TODO: send the error to remote logging infrastructure
          console.error(result.error); // log to console instead

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
