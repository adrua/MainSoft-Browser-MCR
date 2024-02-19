import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { McrcoAutomovilesModel } from './mcrco.automoviles.model';

declare var lastError;

@Injectable({ providedIn: 'root' })
export class McrcoAutomovilesMockService {
    rows: Array<McrcoAutomovilesModel> = [];
    autoincrement = this.rows.length;

    rowsMcrcoSucursalesReclamar: Array<any> = [{
        MCRCOSucursalesDescripcion: "Cartagena - Centro"
    }];

    rowsMcrcoSucursalesEntrega: Array<any> = [{
        MCRCOSucursalesDescripcion: "Barranuilla - San Jose"
    }];

    constructor() { }

    getById(mcrcoAutomovilesId: number): Observable<any> {
        const _filtered = this.rows.filter((x) => x.McrcoAutomovilesId === mcrcoAutomovilesId);

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

    add(row: McrcoAutomovilesModel): Observable<McrcoAutomovilesModel> {
        let _row = McrcoAutomovilesModel.clone(row);
        _row.McrcoAutomovilesId = ++this.autoincrement;       

        this.rows.push(_row);
        return of(_row);
    }

    update(row: McrcoAutomovilesModel, original: McrcoAutomovilesModel): Observable<McrcoAutomovilesModel> {
        const inx = this.rows.findIndex((x) => x.McrcoAutomovilesId === original.McrcoAutomovilesId);

        let _row = null;

        if (inx >= 0) {
            this.rows[inx] = McrcoAutomovilesModel.clone(row);
        } else {
            _row = {
                status: 404,
                statusText: "OK"
            };
            lastError = _row;
        }

        return of(_row);
    }

    save(row: McrcoAutomovilesModel, original: McrcoAutomovilesModel): Observable<McrcoAutomovilesModel> {
        if (row._estado === 'N') {
            return this.add(row);
        } else {
            return this.update(row, original);
        }
    }

    delete(row: McrcoAutomovilesModel): Observable<any> {
        const inx = this.rows.findIndex((x) => x.McrcoAutomovilesId === row.McrcoAutomovilesId);

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

    saveRows(rows: Array<McrcoAutomovilesModel>): Observable<any> {
        const _rows = rows.map((row) => this.add(row));
        return of(_rows);
    }

    filterMcrcoSucursalesDescripcionReclamar(val: string, pageSize: number = 10): Observable<any> {
        let _filtered = this.rowsMcrcoSucursalesReclamar.filter((x) => x.McrcoSucursalesDescripcionReclamar.includes(val)).slice(0, pageSize);
        
        return of(_filtered);
    }

    getByIdMcrcoSucursalesDescripcionReclamar(mcrcoSucursalesId: number): Observable<any> {
        let _filtered = this.rowsMcrcoSucursalesReclamar.filter((x) => x.McrcoSucursalesId === mcrcoSucursalesId);

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

    filterMcrcoSucursalesDescripcionEntrega(val: string, pageSize: number = 10): Observable<any> {
        let _filtered = this.rowsMcrcoSucursalesEntrega.filter((x) => x.McrcoSucursalesDescripcionEntrega.includes(val)).slice(0, pageSize);
        
        return of(_filtered);
    }

    getByIdMcrcoSucursalesDescripcionEntrega(mcrcoSucursalesId: number): Observable<any> {
        let _filtered = this.rowsMcrcoSucursalesEntrega.filter((x) => x.McrcoSucursalesId === mcrcoSucursalesId);

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

    /** Log a McrcoAutomovilesService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`McrcoAutomovilesService: ${message}`);
        console.log(`McrcoAutomovilesService: ${message}`);
    }

}
