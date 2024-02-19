// McrcoSucursales - Table - Angular Testing
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SharedModule } from '../../app.shared.module';
import { McrcoSucursalesModule } from './mcrco.sucursales.module';
import { McrcoSucursalesModel, EnumMcrcoSucursalesEstado } from './mcrco.sucursales.model';
import { McrcoSucursalesService } from './mcrco.sucursales.service';
import { McrcoSucursalesMockService } from './mcrco.sucursales.mockservice.spec';
import { McrcoSucursalesDialog } from './mcrco.sucursales.dialog';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('McrcoSucursalesDialog', () => {
    let component: McrcoSucursalesDialog;
    let fixture: ComponentFixture<McrcoSucursalesDialog>;
    let service: McrcoSucursalesService;
    let _service: McrcoSucursalesService;
    let mockService: McrcoSucursalesMockService;
    let translateService: TranslateService;

    let mockMatDialogRef = {
        close: (data: any) => null
    };

    let rowBase = {
        McrcoSucursalesId: 1234,
        McrcoSucursalesFechaInicio: new Date(2011, 12, 12, 12, 0, 0),
        McrcoSucursalesDescripcion: `Barranquilla - Centro`,
        McrcoSucursalesDireccion: `Calle 44  # 23-50`,
        CiudadDepartamentoId: 276,
        Ciudadid: 276,
        CntCiudadesComp: '', //convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
        McrcoSucursalesLongitud: 10.960379,
        McrcoSucursalesLatitud: 74.79446,
        McrcoSucursalesEstado: EnumMcrcoSucursalesEstado['Activo'],
        CntCiudades: {
            CiudadDepartamentoId: 276,
            Ciudadid: 276,
            Cnt: `276`,
            CiudadNombreCiudad: `Barranquilla`
        },
        _estado: ''
    };

    beforeAll(() => {
        sessionStorage.setItem("token", `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiODMyZTQ1MS1iNzljLTRlMGUtODFmNi1jMDg5MjkzYmM1ZDIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImViNjZlNDUzLTZkZWQtNDVkMi1iNDIxLTE0ODk3M2IzN2FkMCIsImdpdmVuX25hbWUiOiJDcmlzdGlhbiBCcm9jaGVybyIsImlkIjoiZWI2NmU0NTMtNmRlZC00NWQyLWI0MjEtMTQ4OTczYjM3YWQwIiwibWFpbCI6ImNyaXN0aWFuYnJvY2hlcm9yQGdtYWlsLmNvbSIsImV4cCI6MTU5NjY1NTY1MywiaXNzIjoiaHR0cDovL3lvdXJkb21haW4uY29tIiwiYXVkIjoiaHR0cDovL3lvdXJkb21haW4uY29tIn0.5KKYGhDyRW6q0ucWG3WBcdag3RNRZEKeX7gT-MAWbAY`);
    });

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                BrowserAnimationsModule,
                SharedModule.forRoot(),
                McrcoSucursalesModule
            ],
            declarations: [
                McrcoSucursalesDialog,
                McrcoSucursalesDialog
            ],
            providers: [
                { 
                    provide: MAT_DIALOG_DATA, useValue: {
                        selected: new McrcoSucursalesModel(),
                        original: new McrcoSucursalesModel()
                    } 
                },
                { provide: MatDialogRef, useValue: mockMatDialogRef},
                TranslateService, TranslateStore 
            ]
        });

        mockService = new McrcoSucursalesMockService();
        TestBed.overrideProvider(McrcoSucursalesService, { useValue: mockService });

        service = TestBed.inject(McrcoSucursalesService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(McrcoSucursalesDialog);
        _service = fixture.debugElement.injector.get(McrcoSucursalesService);
        component = fixture.componentInstance;
        
        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("McrcoSucursalesMockService")
        expect(_service.constructor.name).toBe("McrcoSucursalesMockService")
    });

    it('should display a Dialog for Add', async () => {
        fixture.autoDetectChanges(true);

        setTimeout(async () => {
            let _guardar = translateService.instant('sktmngrModules._guardar');
            let _eliminar = translateService.instant('sktmngrModules._eliminar');
            let _cancelar = translateService.instant('sktmngrModules._cancelar');
            let _sinErrores = translateService.instant('alertas._sinErrores');

            const [matCardActions] = await parallel(() => [ loader.getChildLoader('mat-card mat-card-actions') ]);

            const [btnGuardar, btnCancelar] = await parallel(() => [ 
                matCardActions.getHarness(MatButtonHarness.with({ text: _guardar })),
                matCardActions.getHarness(MatButtonHarness.with({ text: _cancelar })),
            ]);

            let btnEliminar: HarnessLoader;
            try {
                [btnEliminar] = await parallel(() => [ 
                    matCardActions.getHarness(MatButtonHarness.with({ text: _eliminar }))
                ]);    
            } catch {    
                //No Hacer nada
            }
        
            expect(await btnGuardar.isDisabled()).toBeTruthy();
            expect(btnEliminar).toBeUndefined();
            expect(await btnCancelar.isDisabled()).toBeFalsy();

            const formControls = component.mcrcoSucursalesForm.controls;

            formControls.McrcoSucursalesFechaInicio.setValue(rowBase.McrcoSucursalesFechaInicio);      
            formControls.McrcoSucursalesDescripcion.setValue(rowBase.McrcoSucursalesDescripcion);      
            formControls.McrcoSucursalesDireccion.setValue(rowBase.McrcoSucursalesDireccion);      
            formControls.CiudadDepartamentoId.setValue(rowBase.CiudadDepartamentoId);      
            formControls.Ciudadid.setValue(rowBase.Ciudadid);      
            formControls.McrcoSucursalesLongitud.setValue(rowBase.McrcoSucursalesLongitud);      
            formControls.McrcoSucursalesLatitud.setValue(rowBase.McrcoSucursalesLatitud);      
            formControls.McrcoSucursalesEstado.setValue(rowBase.McrcoSucursalesEstado);      

            expect(component.getErrorMessages()).toBe(_sinErrores);

            try {
                [btnEliminar] = await parallel(() => [ 
                    matCardActions.getHarness(MatButtonHarness.with({ text: _eliminar }))
                ]);    
            } catch {
                //No Hacer nada
            }

            expect(await btnGuardar.isDisabled()).toBeFalsy();
            expect(btnEliminar).toBeUndefined();
            expect(await btnCancelar.isDisabled()).toBeFalsy();

        
            mockMatDialogRef.close = (result) => {
                expect(result.data._estado).toBe('N');
                expect(mockService.rows.length).toBe(1, 'No se guardo la fila');
        
                let row = mockService.rows[0];
                expect(row.McrcoSucursalesId).toBe(mockService.autoincrement);
                expect(row.McrcoSucursalesFechaInicio).toBe(rowBase.McrcoSucursalesFechaInicio);
                expect(row.McrcoSucursalesDescripcion).toBe(rowBase.McrcoSucursalesDescripcion);
                expect(row.McrcoSucursalesDireccion).toBe(rowBase.McrcoSucursalesDireccion);
                expect(row.CiudadDepartamentoId).toBe(rowBase.CiudadDepartamentoId);
                expect(row.Ciudadid).toBe(rowBase.Ciudadid);
                expect(row.McrcoSucursalesLongitud).toBe(rowBase.McrcoSucursalesLongitud);
                expect(row.McrcoSucursalesLatitud).toBe(rowBase.McrcoSucursalesLatitud);
                expect(row.McrcoSucursalesEstado).toBe(rowBase.McrcoSucursalesEstado);
            };

            await btnGuardar.click();
        }, 1);
    });


    it('should display a Dialog for Update', async () => {
        component.selectedMcrcoSucursales = new McrcoSucursalesModel(rowBase);
        component.selectedMcrcoSucursales._estado = 'O';
        component.originalMcrcoSucursales = McrcoSucursalesModel.clone(component.selectedMcrcoSucursales);
        component.originalMcrcoSucursales._estado = 'O';

        mockService.rows.push(component.selectedMcrcoSucursales);
    
        fixture.autoDetectChanges(true);

        setTimeout(async () => {
            let _guardar = translateService.instant('sktmngrModules._guardar');
            let _eliminar = translateService.instant('sktmngrModules._eliminar');
            let _cancelar = translateService.instant('sktmngrModules._cancelar');
            let _sinErrores = translateService.instant('alertas._sinErrores');

            const [matCardActions] = await parallel(() => [ loader.getChildLoader('mat-card mat-card-actions') ]);
            
            let [btnGuardar, btnEliminar, btnCancelar] = await parallel(() => [ 
                matCardActions.getHarness(MatButtonHarness.with({ text: _guardar })),
                matCardActions.getHarness(MatButtonHarness.with({ text: _eliminar })),
                matCardActions.getHarness(MatButtonHarness.with({ text: _cancelar })),
            ]);

            expect(component.getErrorMessages()).toBe(_sinErrores);

            expect(await btnGuardar.isDisabled()).toBeFalsy();
            expect(await btnEliminar.isDisabled()).toBeFalsy();
            expect(await btnCancelar.isDisabled()).toBeFalsy();

            mockMatDialogRef.close = (result) => {
                expect(result.data._estado).toBe('O');
                expect(mockService.rows.length).toBe(1, 'No se guardo la fila');
            
                let row = mockService.rows[0];
                expect(row.McrcoSucursalesId).toBe(rowBase.McrcoSucursalesId);
                expect(row.McrcoSucursalesFechaInicio).toBe(rowBase.McrcoSucursalesFechaInicio);
                expect(row.McrcoSucursalesDescripcion).toBe(rowBase.McrcoSucursalesDescripcion);
                expect(row.McrcoSucursalesDireccion).toBe(rowBase.McrcoSucursalesDireccion);
                expect(row.CiudadDepartamentoId).toBe(rowBase.CiudadDepartamentoId);
                expect(row.Ciudadid).toBe(rowBase.Ciudadid);
                expect(row.McrcoSucursalesLongitud).toBe(rowBase.McrcoSucursalesLongitud);
                expect(row.McrcoSucursalesLatitud).toBe(rowBase.McrcoSucursalesLatitud);
                expect(row.McrcoSucursalesEstado).toBe(rowBase.McrcoSucursalesEstado);
            };

            await btnGuardar.click();
        }, 1);
    });

    it('should display a Dialog for Delete', async () => {
        component.selectedMcrcoSucursales = new McrcoSucursalesModel(rowBase);
        component.selectedMcrcoSucursales._estado = 'O';
        component.originalMcrcoSucursales = McrcoSucursalesModel.clone(component.selectedMcrcoSucursales);
        component.originalMcrcoSucursales._estado = 'O';

        mockService.rows.push(component.selectedMcrcoSucursales);
    
        fixture.autoDetectChanges(true);

        setTimeout(async () => {
            let _guardar = translateService.instant('sktmngrModules._guardar');
            let _eliminar = translateService.instant('sktmngrModules._eliminar');
            let _cancelar = translateService.instant('sktmngrModules._cancelar');
            let _sinErrores = translateService.instant('alertas._sinErrores');
            let _alertaAceptar = translateService.instant('alertasBotones.aceptar');

            const [matCardActions] = await parallel(() => [ loader.getChildLoader('mat-card mat-card-actions') ]);
            
            let [btnGuardar, btnEliminar, btnCancelar] = await parallel(() => [ 
                matCardActions.getHarness(MatButtonHarness.with({ text: _guardar })),
                matCardActions.getHarness(MatButtonHarness.with({ text: _eliminar })),
                matCardActions.getHarness(MatButtonHarness.with({ text: _cancelar })),
            ]);
        
            expect(component.getErrorMessages()).toBe(_sinErrores);

            expect(await btnGuardar.isDisabled()).toBeFalsy();
            expect(await btnEliminar.isDisabled()).toBeFalsy();
            expect(await btnCancelar.isDisabled()).toBeFalsy();

            await btnEliminar.click();

            const [matDialog] = await parallel(() => [ rootLoader.getHarness(MatDialogHarness) ]);

            const okButton = await matDialog.getHarness(MatButtonHarness.with({ text: _alertaAceptar }));

            mockMatDialogRef.close = (result) => {
                expect(result.data._estado).toBe('D');
                expect(mockService.rows.length).toBe(0, 'No se elimino la fila');
            };

            await okButton.click();
        }, 1);
    });
});
