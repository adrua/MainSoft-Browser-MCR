import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { AlertaComponent } from 'arkeos-components';

import { McrcoSucursalesService } from './mcrco.sucursales.service';
import { McrcoSucursalesModel } from './mcrco.sucursales.model';

declare var idioma: string;
declare var idiomas: Array<string>;
@Component({
  selector: 'mcrco-sucursales-dialog',
  templateUrl: './mcrco.sucursales.dialog.html',
  // styleUrls: ['./mcrco.sucursales.dialog.css'],
  providers: [McrcoSucursalesService]
})
export class McrcoSucursalesDialog {
    language = idioma;
    languages = idiomas;
    selectedMcrcoSucursales: McrcoSucursalesModel;
    originalMcrcoSucursales: McrcoSucursalesModel;

    mcrcoSucursalesForm: FormGroup;

    ciudadNombreCiudadCtrl: FormControl = new FormControl(["", [
        (control: AbstractControl): {[key: string]: any} | null => {
            const selected = !!control["selected"];
            let result = null;
            if (control.value !== "" && !selected) {
                result = {"ciudadNombreCiudadCtrl": true };
            }
            return result;
        }] ]);

    filteredCiudadNombreCiudad: Observable<Array<any>>;

    _proc: boolean = false;
    _status: boolean = false;
    resultError: string | null = null;

    constructor(public dialog: MatDialog,
 		        private builder: FormBuilder,
                private translateService: TranslateService,
                private mcrcoSucursalesService: McrcoSucursalesService,
                public dialogRef: MatDialogRef<McrcoSucursalesDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        this.selectedMcrcoSucursales = data.selected;
        this.originalMcrcoSucursales = data.original;

        this.dialogRef.disableClose = true;

        this.mcrcoSucursalesForm = this.builder.group({
            'McrcoSucursalesId': [ this.selectedMcrcoSucursales.McrcoSucursalesId, [ Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'McrcoSucursalesFechaInicio': [ this.selectedMcrcoSucursales.McrcoSucursalesFechaInicio, [ Validators.required ] ],
            'McrcoSucursalesDescripcion': [ this.selectedMcrcoSucursales.McrcoSucursalesDescripcion, [ Validators.required ] ],
            'McrcoSucursalesDireccion': [ this.selectedMcrcoSucursales.McrcoSucursalesDireccion, [ Validators.required ] ],
            'CiudadDepartamentoId': [ this.selectedMcrcoSucursales.CiudadDepartamentoId, [ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'Ciudadid': [ this.selectedMcrcoSucursales.Ciudadid, [ Validators.required, Validators.maxLength(5), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'McrcoSucursalesLongitud': [ this.selectedMcrcoSucursales.McrcoSucursalesLongitud, [ Validators.required, Validators.maxLength(9), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'McrcoSucursalesLatitud': [ this.selectedMcrcoSucursales.McrcoSucursalesLatitud, [ Validators.required, Validators.maxLength(8), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'McrcoSucursalesEstado': [ this.selectedMcrcoSucursales.McrcoSucursalesEstado, [ Validators.required ] ],
            '_estado': [ this.selectedMcrcoSucursales._estado, Validators.required ]
        }, {
                validators: (formGroup: AbstractControl): ValidationErrors | null => {

                    let validationErrors: any = null;

                    return validationErrors;
                }
        });  
    }

    ngOnInit() {
        this.ciudadNombreCiudadCtrl.setValue(this.selectedMcrcoSucursales.CntCiudades?.CiudadNombreCiudad || '');
        this.ciudadNombreCiudadCtrl["CntCiudades"] = this.selectedMcrcoSucursales.CntCiudades;
        this.filteredCiudadNombreCiudad = this.ciudadNombreCiudadCtrl.valueChanges
            .pipe(
                startWith(this.ciudadNombreCiudadCtrl.value),
                switchMap((data) => this.mcrcoSucursalesService.filterCiudadNombreCiudad(data)),
                map((result) => result.value)
            );

        this.mcrcoSucursalesForm.valueChanges.subscribe((data) => {

            this.mcrcoSucursalesForm.patchValue({

            }, {emitEvent: false, onlySelf: true});
        });
    }

    onTotals(totals: McrcoSucursalesModel) {
        this.mcrcoSucursalesForm.patchValue(totals);  
    }

    onSubmit(formData: McrcoSucursalesModel) {
        this._proc = true;
        if (this.mcrcoSucursalesForm.valid) {
            formData = Object.assign(McrcoSucursalesModel.clone(this.originalMcrcoSucursales), formData);
            this.mcrcoSucursalesService.save(formData, this.originalMcrcoSucursales).subscribe((data: any) => {
                this._proc = false;
                this._status = !data?.error && !data?.message;
                this.resultError = null;

                if (this._status) {
                    formData = Object.assign(this.originalMcrcoSucursales, formData);
                    if(formData._estado === 'N') {
                        formData.McrcoSucursalesId = data.McrcoSucursalesId;

                    }

                    formData.CntCiudades = this.ciudadNombreCiudadCtrl["CntCiudades"];
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

    onDelete(formData: McrcoSucursalesModel) {
        if (this.mcrcoSucursalesForm.valid) {
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
                    this.mcrcoSucursalesService.delete(this.selectedMcrcoSucursales).subscribe((data: any) => {
                        this._proc = false;
                        this._status = !data?.error && !data?.message;
                        this.resultError = null;

                        if (this._status) {
                            this.originalMcrcoSucursales._estado = 'D';
                            this.dialogRef.close({
                                data: this.originalMcrcoSucursales,
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

    onKeydownCiudadNombreCiudad(e: KeyboardEvent) {
        if (e.key === 'Tab' || e.key === 'Enter') {
            return;
        }

        this.ciudadNombreCiudadCtrl["selected"] = false;

        this.mcrcoSucursalesForm.patchValue({
            CiudadDepartamentoId: null,
            Ciudadid: null
        });
    }

    displayFnCiudadNombreCiudad = (opt: any): string => {
        if(opt.CiudadNombreCiudad) {

            this.ciudadNombreCiudadCtrl["selected"] = true;
            this.ciudadNombreCiudadCtrl["CntCiudades"] = opt;

            this.mcrcoSucursalesForm.patchValue({
                CiudadDepartamentoId: opt.CiudadDepartamentoId,
                Ciudadid: opt.Ciudadid
            });

        } else {
            opt = this.ciudadNombreCiudadCtrl["CntCiudades"];
        }
        return opt.CiudadNombreCiudad;
    }

    getErrorMessages(): string {
        let errors = "";
        let _errors = this.mcrcoSucursalesForm.errors || {};
        Object.keys(_errors).forEach(key => {
            errors += `, ${key}: ${_errors[key]}\n`;
        });

        let controls = this.mcrcoSucursalesForm.controls;

        Object.keys(controls).forEach(key => {
            Object.keys(controls[key].errors || {}).forEach(errKey => {
                errors += `, ${key}: ${errKey}
`;
            });
        });

        return (errors || `, ${this.translateService.instant('alertas._sinErrores')}`).substr(2);
    }
}
