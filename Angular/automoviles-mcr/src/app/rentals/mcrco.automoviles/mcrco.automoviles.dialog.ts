import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { AlertaComponent } from 'arkeos-components';

import { McrcoAutomovilesService } from './mcrco.automoviles.service';
import { McrcoAutomovilesModel } from './mcrco.automoviles.model';

declare var idioma: string;
declare var idiomas: Array<string>;
@Component({
  selector: 'mcrco-automoviles-dialog',
  templateUrl: './mcrco.automoviles.dialog.html',
  // styleUrls: ['./mcrco.automoviles.dialog.css'],
  providers: [McrcoAutomovilesService]
})
export class McrcoAutomovilesDialog {
    language = idioma;
    languages = idiomas;
    selectedMcrcoAutomoviles: McrcoAutomovilesModel;
    originalMcrcoAutomoviles: McrcoAutomovilesModel;

    mcrcoAutomovilesForm: FormGroup;

    mcrcoSucursalesDescripcionReclamarCtrl: FormControl = new FormControl(["", [
        (control: AbstractControl): {[key: string]: any} | null => {
            const selected = !!control["selected"];
            let result = null;
            if (control.value !== "" && !selected) {
                result = {"mcrcoSucursalesDescripcionReclamarCtrl": true };
            }
            return result;
        }] ]);

    filteredMcrcoSucursalesDescripcionReclamar: Observable<Array<any>>;
    mcrcoSucursalesDescripcionEntregaCtrl: FormControl = new FormControl(["", [
        (control: AbstractControl): {[key: string]: any} | null => {
            const selected = !!control["selected"];
            let result = null;
            if (control.value !== "" && !selected) {
                result = {"mcrcoSucursalesDescripcionEntregaCtrl": true };
            }
            return result;
        }] ]);

    filteredMcrcoSucursalesDescripcionEntrega: Observable<Array<any>>;

    _proc: boolean = false;
    _status: boolean = false;
    resultError: string | null = null;

    constructor(public dialog: MatDialog,
 		        private builder: FormBuilder,
                private translateService: TranslateService,
                private mcrcoAutomovilesService: McrcoAutomovilesService,
                public dialogRef: MatDialogRef<McrcoAutomovilesDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        this.selectedMcrcoAutomoviles = data.selected;
        this.originalMcrcoAutomoviles = data.original;

        this.dialogRef.disableClose = true;

        this.mcrcoAutomovilesForm = this.builder.group({
            'McrcoAutomovilesId': [ this.selectedMcrcoAutomoviles.McrcoAutomovilesId, [ Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'McrcoAutomovilesFechaIngreso': [ this.selectedMcrcoAutomoviles.McrcoAutomovilesFechaIngreso, [ Validators.required ] ],
            'McrcoAutomovilesMarca': [ this.selectedMcrcoAutomoviles.McrcoAutomovilesMarca, [ Validators.required ] ],
            'McrcoAutomovilesModelo': [ this.selectedMcrcoAutomoviles.McrcoAutomovilesModelo, [ Validators.required ] ],
            'McrcoAutomovilesAno': [ this.selectedMcrcoAutomoviles.McrcoAutomovilesAno, [ Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'McrcoAutomovilesClase': [ this.selectedMcrcoAutomoviles.McrcoAutomovilesClase, [ Validators.required ] ],
            'McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar': [ this.selectedMcrcoAutomoviles.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar, [ Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega': [ this.selectedMcrcoAutomoviles.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega, [ Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'McrcoAutomovilesEstado': [ this.selectedMcrcoAutomoviles.McrcoAutomovilesEstado, [ Validators.required ] ],
            '_estado': [ this.selectedMcrcoAutomoviles._estado, Validators.required ]
        }, {
                validators: (formGroup: AbstractControl): ValidationErrors | null => {

                    let validationErrors: any = null;

                    return validationErrors;
                }
        });  
    }

    ngOnInit() {
        this.mcrcoSucursalesDescripcionReclamarCtrl.setValue(this.selectedMcrcoAutomoviles.McrcoSucursalesReclamar?.McrcoSucursalesDescripcion || '');
        this.mcrcoSucursalesDescripcionReclamarCtrl["McrcoSucursalesReclamar"] = this.selectedMcrcoAutomoviles.McrcoSucursalesReclamar;
        this.filteredMcrcoSucursalesDescripcionReclamar = this.mcrcoSucursalesDescripcionReclamarCtrl.valueChanges
            .pipe(
                startWith(this.mcrcoSucursalesDescripcionReclamarCtrl.value),
                switchMap((data) => this.mcrcoAutomovilesService.filterMcrcoSucursalesDescripcionReclamar(data)),
                map((result) => result.value)
            );

        this.mcrcoSucursalesDescripcionEntregaCtrl.setValue(this.selectedMcrcoAutomoviles.McrcoSucursalesEntrega?.McrcoSucursalesDescripcion || '');
        this.mcrcoSucursalesDescripcionEntregaCtrl["McrcoSucursalesEntrega"] = this.selectedMcrcoAutomoviles.McrcoSucursalesEntrega;
        this.filteredMcrcoSucursalesDescripcionEntrega = this.mcrcoSucursalesDescripcionEntregaCtrl.valueChanges
            .pipe(
                startWith(this.mcrcoSucursalesDescripcionEntregaCtrl.value),
                switchMap((data) => this.mcrcoAutomovilesService.filterMcrcoSucursalesDescripcionEntrega(data)),
                map((result) => result.value)
            );

        this.mcrcoAutomovilesForm.valueChanges.subscribe((data) => {

            this.mcrcoAutomovilesForm.patchValue({

            }, {emitEvent: false, onlySelf: true});
        });
    }

    onTotals(totals: McrcoAutomovilesModel) {
        this.mcrcoAutomovilesForm.patchValue(totals);  
    }

    onSubmit(formData: McrcoAutomovilesModel) {
        this._proc = true;
        if (this.mcrcoAutomovilesForm.valid) {
            formData = Object.assign(McrcoAutomovilesModel.clone(this.originalMcrcoAutomoviles), formData);
            this.mcrcoAutomovilesService.save(formData, this.originalMcrcoAutomoviles).subscribe((data: any) => {
                this._proc = false;
                this._status = !data?.error && !data?.message;
                this.resultError = null;

                if (this._status) {
                    formData = Object.assign(this.originalMcrcoAutomoviles, formData);
                    if(formData._estado === 'N') {
                        formData.McrcoAutomovilesId = data.McrcoAutomovilesId;

                    }

                    formData.McrcoSucursalesReclamar = this.mcrcoSucursalesDescripcionReclamarCtrl["McrcoSucursalesReclamar"];
                    formData.McrcoSucursalesEntrega = this.mcrcoSucursalesDescripcionEntregaCtrl["McrcoSucursalesEntrega"];
                    this.dialogRef.close({
                        data: formData
                    });
                } else {
                   this.resultError = data.error?.value || data.message;
                   this.openNotificationDanger('alertas.guardar.error', this.resultError ?? "")
                }
            });
        }
    }

    onDelete(formData: McrcoAutomovilesModel) {
        if (this.mcrcoAutomovilesForm.valid) {
            const dialogRef = this.dialog.open(AlertaComponent, {
                data: {
                    tipo: 'error',
                    titulo: this.translateService.instant('alertas.eliminar.titulo'),
                    mensaje: this.translateService.instant('alertas.eliminar.mensaje')
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result.data) {
                    this._proc = true;
                    this.mcrcoAutomovilesService.delete(this.selectedMcrcoAutomoviles).subscribe((data: any) => {
                        this._proc = false;
                        this._status = !data?.error && !data?.message;
                        this.resultError = null;

                        if (this._status) {
                            this.originalMcrcoAutomoviles._estado = 'D';
                            this.dialogRef.close({
                                data: this.originalMcrcoAutomoviles,
                                delete: true
                            });
                        } else {
                            this.resultError = data.error?.value || data.message;
                            this.openNotificationDanger('alertas.eliminar.error', this.resultError);
                        }
                    });
                }
            });
        }
    }

    openNotificationDanger(titulo: string, mensaje: string) {
        const dialogRef = this.dialog.open(AlertaComponent, {
            data: {
                tipo: 'error',
                titulo: this.translateService.instant(titulo),
                mensaje: mensaje
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result.data) {
                this.dialogRef.close();
            }
        });
    }

    onKeydownMcrcoSucursalesDescripcionReclamar(e: KeyboardEvent) {
        if (e.key === 'Tab' || e.key === 'Enter') {
            return;
        }

        this.mcrcoSucursalesDescripcionReclamarCtrl["selected"] = false;

        this.mcrcoAutomovilesForm.patchValue({
            McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar: null
        });
    }

    displayFnMcrcoSucursalesDescripcionReclamar = (opt: any): string => {
        if(opt.McrcoSucursalesDescripcion) {

            this.mcrcoSucursalesDescripcionReclamarCtrl["selected"] = true;
            this.mcrcoSucursalesDescripcionReclamarCtrl["McrcoSucursalesReclamar"] = opt;

            this.mcrcoAutomovilesForm.patchValue({
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar: opt.McrcoSucursalesId
            });

        } else {
            opt = this.mcrcoSucursalesDescripcionReclamarCtrl["McrcoSucursalesReclamar"];
        }
        return opt.McrcoSucursalesDescripcion;
    }

    onKeydownMcrcoSucursalesDescripcionEntrega(e: KeyboardEvent) {
        if (e.key === 'Tab' || e.key === 'Enter') {
            return;
        }

        this.mcrcoSucursalesDescripcionEntregaCtrl["selected"] = false;

        this.mcrcoAutomovilesForm.patchValue({
            McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar: null
        });
    }

    displayFnMcrcoSucursalesDescripcionEntrega = (opt: any): string => {
        if(opt.McrcoSucursalesDescripcion) {

            this.mcrcoSucursalesDescripcionEntregaCtrl["selected"] = true;
            this.mcrcoSucursalesDescripcionEntregaCtrl["McrcoSucursalesEntrega"] = opt;

            this.mcrcoAutomovilesForm.patchValue({
                McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar: opt.McrcoSucursalesId
            });

        } else {
            opt = this.mcrcoSucursalesDescripcionEntregaCtrl["McrcoSucursalesEntrega"];
        }
        return opt.McrcoSucursalesDescripcion;
    }

    getErrorMessages(): string {
        let errors = "";
        let _errors = this.mcrcoAutomovilesForm.errors || {};
        Object.keys(_errors).forEach(key => {
            errors += `, ${key}: ${_errors[key]}\n`;
        });

        let controls = this.mcrcoAutomovilesForm.controls;

        Object.keys(controls).forEach(key => {
            Object.keys(controls[key].errors || {}).forEach(errKey => {
                errors += `, ${key}: ${errKey}
`;
            });
        });

        return (errors || `, ${this.translateService.instant('alertas._sinErrores')}`).substr(2);
    }
}
