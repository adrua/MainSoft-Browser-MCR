import { Component, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, delay, map, startWith, switchMap } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { AlertasArkeosComponent, DescargaExcelModule } from 'arkeos-components';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import { McrcoSucursalesDialog } from './mcrco.sucursales.dialog';
import { McrcoSucursalesService } from './mcrco.sucursales.service';
import { McrcoSucursalesModel } from './mcrco.sucursales.model';

declare var conditionsLists: any;

@Component({
  selector: 'mcrco-sucursales-table',
  templateUrl: './mcrco.sucursales.table.html',
  styles: [`.mat-column-select {
    flex: 0 0 3%;
}`],
  // styleUrls: ['./mcrco.sucursales.table.css'],
  providers: [McrcoSucursalesService]
})
export class McrcoSucursalesTable implements AfterViewInit {
    rows: McrcoSucursalesModel[] = [];
    originals: McrcoSucursalesModel[] = [];
    selectedRow: McrcoSucursalesModel;
    selectedIndex: number = 0;
    originalRow: McrcoSucursalesModel;

    public displayedColumns: string[] = ['mcrcoSucursalesFechaInicio', 'mcrcoSucursalesDescripcion', 'mcrcoSucursalesDireccion', 'cntCiudades/ciudadNombreCiudad', 'mcrcoSucursalesLongitud', 'mcrcoSucursalesLatitud', 'mcrcoSucursalesEstado'];

    public conditionsList = conditionsLists.Varchar;
    public searchValue: any = {};
    public searchCondition: any = {};
    public searchColumn: any = {};
    public _pageSize = 10;

    selectedColumn = {
        name: '',
        dbName: '',
        type: '',
        sign: '',
        filter: []
    };

    resultsLength = 0;
    isLoadingResults = false;
    isRateLimitReached = false;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    set pageIndex(value: number) {
        this.paginator.pageIndex = value;
        this.paginator.page.emit();
    }

    get pageIndex(): number {
        return this.paginator.pageIndex;
    }

    @ViewChild(MatSort, { static: false }) sort: MatSort;

    _proc: boolean = false;
    _status: boolean = false;

    constructor(public dialog: MatDialog,
                private bottomSheet: MatBottomSheet,
                private snackBar: MatSnackBar,
                private mcrcoSucursalesService: McrcoSucursalesService) { }

    ngAfterViewInit() {
        // If the user changes the sort order, reset back to the first page.
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
          .pipe(
            startWith({}),
            delay(0),
            switchMap(() => {
              this.isLoadingResults = true;

              let _filter = '';
              for (var filterKey in this.searchValue) {
                let filter = {
                  column: this.searchColumn[filterKey].dbName,
                  condition: this.searchCondition[filterKey].value,
                  value: this.searchValue[filterKey],
                  generate: this.searchCondition[filterKey].filter
                } 

                _filter += ` and ${filter.generate(filter)}`;
              }
              _filter = (_filter) ? _filter.substr(5) : _filter;

              return this.mcrcoSucursalesService.getList(_filter, this.paginator, this.sort);
            }),
            map(data => {
              // Flip flag to show that loading has finished.
              this.isLoadingResults = false;
              this.isRateLimitReached = false;
              this.resultsLength = data["@odata.count"] || 0;

              if (data.error) {
                this.openNotificationDanger(data.message); 
              }

              return data.value || [];
            }),
            catchError(() => {
              this.isLoadingResults = false;
              // Catch if the API has reached its rate limit. Return empty data.
              this.isRateLimitReached = true;
              return observableOf({
                "@odata.count": 0,
                value: []
              });
            })
          ).subscribe(data => {
            this.rows = [...data];
            this.originals = data;
          });
    }

    onAdd(): void {
      this.selectedRow = new McrcoSucursalesModel();
      this.originalRow = new McrcoSucursalesModel();
      this.selectedIndex = 0;

      this.openDialog();
    }

    onEdit(): void {
     if (this.selectedRow && this.selectedRow._estado != 'N') {
       this.selectedRow._estado = 'O';
       this.originalRow._estado = 'O';
       this.openDialog();
	 } else {
       this.bottomSheet.open(AlertasArkeosComponent, {
         data: {
           mensajeTranslate: 'alertas._mensajeSelectRow',
           nombreBoton1: 'Main._aceptar',
         }
       });
     }
    }

    onRefresh() {
        this.paginator.page.emit();
    }

    onSelect(e: Event, row: McrcoSucursalesModel, index: number) {
        this.selectedRow = row;
        this.selectedIndex = index;
        this.originalRow = McrcoSucursalesModel.clone(row);
    }

    onSelectAndEdit(e: Event, row: McrcoSucursalesModel, index: number) {
        this.selectedRow = row;
        this.selectedRow._estado = 'O';
        this.selectedIndex = index;
        this.originalRow = McrcoSucursalesModel.clone(row);
        this.originalRow._estado = 'O';

        this.openDialog();
    }

    onSelectColumn(e: Event, name: string, columnType: string, dbName: string, sign: string) {
        this.selectedColumn.name = name;
        this.selectedColumn.dbName = dbName;
        this.selectedColumn.type = columnType;
        this.selectedColumn.sign = sign;
        this.selectedColumn.filter = conditionsLists[columnType] || conditionsLists.Varchar;

        this.searchColumn[name] = Object.assign(this.searchColumn[name] || {}, this.selectedColumn); 
    }

    onApplyFilter(e: Event) {
        this.paginator.page.emit();
    }

    onClearColumn(e: Event) {
        delete this.searchValue[this.selectedColumn.name];
        delete this.searchCondition[this.selectedColumn.name];

        this.onRefresh();
    }

    onExportExcel(e: Event) {
        this.isLoadingResults = true;
        this.mcrcoSucursalesService.getAll().subscribe(data => {
            if (data.value.length == 0) {
                this.isLoadingResults = false;
                this.bottomSheet.open(AlertasArkeosComponent, {
                data: {
                    mensajeTranslate: 'alertas._mensajeNoData',
                    nombreBoton1: 'Main._aceptar',
                }
                });
            } else {
                DescargaExcelModule.generarArchivoExcel(McrcoSucursalesModel.cloneExcel(data.value), 'Sucursales');
                this.isLoadingResults = false;
            }
        });
    }

    onCopyRows(e: Event) {
        let result = this.displayedColumns.join('\t') + '\n';
        this.mcrcoSucursalesService.getAll().subscribe((data: any) => {
            data.forEach((row) => result += new McrcoSucursalesModel(row).toClipboard() + '\n');
            (navigator as any).clipboard.writeText(result)
                .then(
                    () => console.log('write to clipboard OK'),
                    () => console.log('write to clipboard failed'
                )
            );
        });
    }

    onPasteRows(e: Event) {
        (navigator as any).clipboard.readText().then((text: string) => {
            let rows = text.split("\n").filter((line) => line.length > 0).map((line) => {
                return new McrcoSucursalesModel().fromClipboard(line);
            });

            this.mcrcoSucursalesService.saveRows(rows).subscribe((data: any) => {
                console.log('Saved rows for McrcoSucursales');
                this.paginator.page.emit();
            });
        });
    }

    onTotals(data: any) {
        Object.assign(this.selectedRow, data);
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(McrcoSucursalesDialog, {
          data: {
            selected: this.selectedRow,
            original: this.originalRow
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            Object.assign(this.selectedRow, result.data);
            switch (this.selectedRow._estado )
            {
              case 'N':
                this.selectedRow._estado = 'O';
                this.selectedIndex = this.rows.length;
                this.rows.push(this.selectedRow);
                this.originals.push(this.selectedRow);
                this.rows = [...this.rows];
                this.resultsLength = this.rows.length;
                break;
              case 'D':
                this.rows.splice(this.selectedIndex, 1);
                this.rows = [...this.rows];
                this.resultsLength -= 1;
                this.selectedRow = null;
                break;
            }
          }
        });
    }

    openNotificationDanger(message: string, action?: string) {
       this.snackBar.open(message, action, {
           duration: 2000,
           panelClass: 'dangerSnackBar',
       });
    }

    formatPageLabel(value: number) {
        return value + 1;
    }
}
