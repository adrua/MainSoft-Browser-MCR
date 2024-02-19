// McrcoAutomoviles - Table - Angular Testing
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
import { McrcoAutomovilesModule } from './mcrco.automoviles.module';
import { McrcoAutomovilesModel, EnumMcrcoAutomovilesEstado } from './mcrco.automoviles.model';
import { McrcoAutomovilesService } from './mcrco.automoviles.service';
import { McrcoAutomovilesMockService } from './mcrco.automoviles.mockservice.spec';
import { McrcoAutomovilesDialog } from './mcrco.automoviles.dialog';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('McrcoAutomovilesDialog', () => {
    let component: McrcoAutomovilesDialog;
    let fixture: ComponentFixture<McrcoAutomovilesDialog>;
    let service: McrcoAutomovilesService;
    let _service: McrcoAutomovilesService;
    let mockService: McrcoAutomovilesMockService;
    let translateService: TranslateService;

    let mockMatDialogRef = {
        close: (data: any) => null
    };

    let rowBase = {
        McrcoAutomovilesId: 1234,
        McrcoAutomovilesFechaIngreso: new Date(2011, 12, 12, 12, 0, 0),
        McrcoAutomovilesMarca: `Tesla`,
        McrcoAutomovilesModelo: `Toadster`,
        McrcoAutomovilesAno: 2023,
        McrcoAutomovilesClase: `Electrico`,
        McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar: 273,
        McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega: 335,
        McrcoAutomovilesEstado: EnumMcrcoAutomovilesEstado['Disponible'],
        McrcoSucursalesReclamar: {
            MCRCOSucursalesDescripcion: `Cartagena - Centro`
        },
        McrcoSucursalesEntrega: {
            MCRCOSucursalesDescripcion: `Barranuilla - San Jose`
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
                McrcoAutomovilesModule
            ],
            declarations: [
                McrcoAutomovilesDialog,
                McrcoAutomovilesDialog
            ],
            providers: [
                { 
                    provide: MAT_DIALOG_DATA, useValue: {
                        selected: new McrcoAutomovilesModel(),
                        original: new McrcoAutomovilesModel()
                    } 
                },
                { provide: MatDialogRef, useValue: mockMatDialogRef},
                TranslateService, TranslateStore 
            ]
        });

        mockService = new McrcoAutomovilesMockService();
        TestBed.overrideProvider(McrcoAutomovilesService, { useValue: mockService });

        service = TestBed.inject(McrcoAutomovilesService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(McrcoAutomovilesDialog);
        _service = fixture.debugElement.injector.get(McrcoAutomovilesService);
        component = fixture.componentInstance;
        
        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("McrcoAutomovilesMockService")
        expect(_service.constructor.name).toBe("McrcoAutomovilesMockService")
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

            const formControls = component.mcrcoAutomovilesForm.controls;

            formControls.McrcoAutomovilesFechaIngreso.setValue(rowBase.McrcoAutomovilesFechaIngreso);      
            formControls.McrcoAutomovilesMarca.setValue(rowBase.McrcoAutomovilesMarca);      
            formControls.McrcoAutomovilesModelo.setValue(rowBase.McrcoAutomovilesModelo);      
            formControls.McrcoAutomovilesAno.setValue(rowBase.McrcoAutomovilesAno);      
            formControls.McrcoAutomovilesClase.setValue(rowBase.McrcoAutomovilesClase);      
            formControls.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar.setValue(rowBase.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar);      
            formControls.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega.setValue(rowBase.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega);      
            formControls.McrcoAutomovilesEstado.setValue(rowBase.McrcoAutomovilesEstado);      

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
                expect(row.McrcoAutomovilesId).toBe(mockService.autoincrement);
                expect(row.McrcoAutomovilesFechaIngreso).toBe(rowBase.McrcoAutomovilesFechaIngreso);
                expect(row.McrcoAutomovilesMarca).toBe(rowBase.McrcoAutomovilesMarca);
                expect(row.McrcoAutomovilesModelo).toBe(rowBase.McrcoAutomovilesModelo);
                expect(row.McrcoAutomovilesAno).toBe(rowBase.McrcoAutomovilesAno);
                expect(row.McrcoAutomovilesClase).toBe(rowBase.McrcoAutomovilesClase);
                expect(row.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar).toBe(rowBase.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar);
                expect(row.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega).toBe(rowBase.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega);
                expect(row.McrcoAutomovilesEstado).toBe(rowBase.McrcoAutomovilesEstado);
            };

            await btnGuardar.click();
        }, 1);
    });


    it('should display a Dialog for Update', async () => {
        component.selectedMcrcoAutomoviles = new McrcoAutomovilesModel(rowBase);
        component.selectedMcrcoAutomoviles._estado = 'O';
        component.originalMcrcoAutomoviles = McrcoAutomovilesModel.clone(component.selectedMcrcoAutomoviles);
        component.originalMcrcoAutomoviles._estado = 'O';

        mockService.rows.push(component.selectedMcrcoAutomoviles);
    
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
                expect(row.McrcoAutomovilesId).toBe(rowBase.McrcoAutomovilesId);
                expect(row.McrcoAutomovilesFechaIngreso).toBe(rowBase.McrcoAutomovilesFechaIngreso);
                expect(row.McrcoAutomovilesMarca).toBe(rowBase.McrcoAutomovilesMarca);
                expect(row.McrcoAutomovilesModelo).toBe(rowBase.McrcoAutomovilesModelo);
                expect(row.McrcoAutomovilesAno).toBe(rowBase.McrcoAutomovilesAno);
                expect(row.McrcoAutomovilesClase).toBe(rowBase.McrcoAutomovilesClase);
                expect(row.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar).toBe(rowBase.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar);
                expect(row.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega).toBe(rowBase.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega);
                expect(row.McrcoAutomovilesEstado).toBe(rowBase.McrcoAutomovilesEstado);
            };

            await btnGuardar.click();
        }, 1);
    });

    it('should display a Dialog for Delete', async () => {
        component.selectedMcrcoAutomoviles = new McrcoAutomovilesModel(rowBase);
        component.selectedMcrcoAutomoviles._estado = 'O';
        component.originalMcrcoAutomoviles = McrcoAutomovilesModel.clone(component.selectedMcrcoAutomoviles);
        component.originalMcrcoAutomoviles._estado = 'O';

        mockService.rows.push(component.selectedMcrcoAutomoviles);
    
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
