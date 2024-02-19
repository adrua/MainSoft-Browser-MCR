// McrcoSucursales - Table - Angular Testing
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService, TranslateStore } from '@ngx-translate/core';

import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatIconHarness } from '@angular/material/icon/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MatCardHarness } from '@angular/material/card/testing';

import { McrcoSucursalesModule } from './mcrco.sucursales.module';
import { McrcoSucursalesModel, EnumMcrcoSucursalesEstado } from './mcrco.sucursales.model';
import { McrcoSucursalesService } from './mcrco.sucursales.service';
import { McrcoSucursalesMockService } from './mcrco.sucursales.mockservice.spec';
import { McrcoSucursalesTable } from './mcrco.sucursales.table';
import { McrcoSucursalesDialog } from './mcrco.sucursales.dialog';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('McrcoSucursalesTable', () => {
    let component: McrcoSucursalesTable;
    let fixture: ComponentFixture<McrcoSucursalesTable>;
    let service: McrcoSucursalesService;
    let _service: McrcoSucursalesService;
    let mockService: McrcoSucursalesMockService;
    let translateService: TranslateService;

    let rowBase = {
        McrcoSucursalesId: 1234,
        McrcoSucursalesFechaInicio: new Date(2011, 12, 12, 12, 0, 0),
        McrcoSucursalesDescripcion: `Barranquilla - Centro `,
        McrcoSucursalesDireccion: `Calle 44  # 23-50`,
        CiudadDepartamentoId: 276,
        Ciudadid: 276,
        CntCiudades_Comp: '', //convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
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
        await TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                BrowserAnimationsModule,
                McrcoSucursalesModule
            ],
            declarations: [
                McrcoSucursalesTable,
                McrcoSucursalesDialog
            ],
            providers: [
                TranslateService, TranslateStore
            ]
        });

        mockService = new McrcoSucursalesMockService();
        TestBed.overrideProvider(McrcoSucursalesService, { useValue: mockService });

        service = TestBed.inject(McrcoSucursalesService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(McrcoSucursalesTable);
        _service = fixture.debugElement.injector.get(McrcoSucursalesService);
        component = fixture.componentInstance;

        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

        fixture.autoDetectChanges(true);

    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("McrcoSucursalesMockService")
        expect(_service.constructor.name).toBe("McrcoSucursalesMockService")
    });

    it('should display a rows', async () => {
        const [divLoader] = await parallel(() => [ loader.getChildLoader('div.mat-table-scroll') ]);

        const matTable = await divLoader.getHarness(MatTableHarness);
        let [matTableRows] = await parallel(() => [ matTable.getRows() ]);

        expect(matTableRows.length).toBe(0)

        mockService.rows.push(new McrcoSucursalesModel(rowBase));
        mockService.rows.push(new McrcoSucursalesModel(rowBase));

        const toolbarLoader = await loader.getChildLoader('mat-toolbar');
        const toolbarRowLoader = await toolbarLoader.getChildLoader('mat-toolbar-row');
        const refreshIcon = await toolbarRowLoader.getHarness(MatIconHarness.with({name: 'refresh'}));
        const refreshIconHost = await refreshIcon.host();

        await refreshIconHost.click();

        setTimeout(async () => {
            [matTableRows] = await parallel(() => [ matTable.getRows() ]);

            expect(matTableRows.length).toBe(2);
        }, 1);
    });

    it('should display a Dialog for Add', async () => {
        const toolbarLoader = await loader.getChildLoader('mat-toolbar');
        const toolbarRowLoader = await toolbarLoader.getChildLoader('mat-toolbar-row');
        const addIcon = await toolbarRowLoader.getHarness(MatIconHarness.with({name: 'add'}));
        const addIconHost = await addIcon.host();

        await addIconHost.click();

        setTimeout(async () => {
            let _titulo = translateService.instant('mcrcoSucursales._titulo');

            const [matDialog] = await parallel(() => [ rootLoader.getHarness(MatDialogHarness) ]);
            expect(matDialog).toBeTruthy();

            const [matCard] = await parallel(() => [ matDialog.getHarness(MatCardHarness) ]);
            expect(await matCard.getTitleText()).toBe(_titulo);
            await matDialog.close();
        }, 1);
    });

});
