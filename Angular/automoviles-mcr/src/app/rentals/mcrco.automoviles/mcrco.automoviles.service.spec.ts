// McrcoAutomoviles - Service - Angular Testing
import { asyncData, asyncError } from '../../../testing/async-observable-helpers';
import { HttpErrorResponse } from '@angular/common/http';

import { McrcoAutomovilesModel, EnumMcrcoAutomovilesEstado } from './mcrco.automoviles.model';
import { McrcoAutomovilesService } from './mcrco.automoviles.service';


describe('McrcoAutomovilesService', () => {
    let httpClientSpy: {
      get: jasmine.Spy,
      post: jasmine.Spy,
      put: jasmine.Spy,
      patch: jasmine.Spy,
      delete: jasmine.Spy
    };

    let service: McrcoAutomovilesService;

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

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'patch', 'delete']);
        service = new McrcoAutomovilesService(httpClientSpy as any, 'https://localhost', true);
    });

    it('#getById should return One Row', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData(rowBase));

        let row = new McrcoAutomovilesModel(rowBase);

        service.getById(row.McrcoAutomovilesId).subscribe((value) => {
		    expect(value.McrcoAutomovilesId).toBe(row.McrcoAutomovilesId);
		    expect(new Date(value.McrcoAutomovilesFechaIngreso)).toEqual(row.McrcoAutomovilesFechaIngreso);
		    expect(value.McrcoAutomovilesMarca).toBe(row.McrcoAutomovilesMarca);
		    expect(value.McrcoAutomovilesModelo).toBe(row.McrcoAutomovilesModelo);
		    expect(value.McrcoAutomovilesAno).toBe(row.McrcoAutomovilesAno);
		    expect(value.McrcoAutomovilesClase).toBe(row.McrcoAutomovilesClase);
		    expect(value.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar).toBe(row.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar);
		    expect(value.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega).toBe(row.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega);
		    expect(value.McrcoAutomovilesEstado).toBe(row.McrcoAutomovilesEstado);
            done();
        });
    });

    it('#getById should return 404 Not found', (done: DoneFn) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Not Found',
            status: 404,
            statusText: 'Not Found'
        });

        httpClientSpy.get.and.returnValue(asyncError(errorResponse));

        let row = new McrcoAutomovilesModel(rowBase);

        service.getById(row.McrcoAutomovilesId).subscribe((value) => {
                console.log(`#getById.Error: ${JSON.stringify(value)}`);
                expect(value.statusText).toEqual('Not Found')
                expect(value.status).toBe(404)
                done();
            },
            (error) => {
                fail(`expected an error, not McrcoAutomovilesModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });

    it('#getAll should return array of rows', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData({ value: [rowBase, rowBase] }));

        service.getAll().subscribe(value => {
            let result = value?.value;
            expect(result?.length).toEqual(2);
            done();
        });
    });

    it('#getList return array of rows', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData({ value: [rowBase, rowBase] }));

        let filter = '';

        let paginator = {
            pageIndex: 0,
            pageSize: 10
        };

        let sort = {
            active: '',
            direction: ''
        };

        service.getList(filter, <any>paginator, <any>sort).subscribe(value => {
          let result = value?.value;
            expect(result?.length).toEqual(2);
            done();
        });
    });

    it('#save-Add should return a Add row', (done: DoneFn) => {
        httpClientSpy.post.and.returnValue(asyncData(rowBase));

        let row = new McrcoAutomovilesModel(rowBase);
        row._estado = 'N';
        delete row.McrcoAutomovilesId;

        //Add - McrcoAutomoviles
        service.save(row, row).subscribe(value => {
		    expect(new Date(value.McrcoAutomovilesFechaIngreso)).toEqual(row.McrcoAutomovilesFechaIngreso);
		    expect(value.McrcoAutomovilesMarca).toBe(row.McrcoAutomovilesMarca);
		    expect(value.McrcoAutomovilesModelo).toBe(row.McrcoAutomovilesModelo);
		    expect(value.McrcoAutomovilesAno).toBe(row.McrcoAutomovilesAno);
		    expect(value.McrcoAutomovilesClase).toBe(row.McrcoAutomovilesClase);
		    expect(value.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar).toBe(row.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar);
		    expect(value.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega).toBe(row.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega);
		    expect(value.McrcoAutomovilesEstado).toBe(row.McrcoAutomovilesEstado);
            done();
        });
    });

    it('#save-Update should return a updated row', (done: DoneFn) => {
        httpClientSpy.patch.and.returnValue(asyncData(rowBase));

        let row = new McrcoAutomovilesModel(rowBase);
        row._estado = 'O';
        delete row.McrcoAutomovilesId;

        //Update - McrcoAutomoviles
        service.save(row, row).subscribe(value => {
		    expect(new Date(value.McrcoAutomovilesFechaIngreso)).toEqual(row.McrcoAutomovilesFechaIngreso);
		    expect(value.McrcoAutomovilesMarca).toBe(row.McrcoAutomovilesMarca);
		    expect(value.McrcoAutomovilesModelo).toBe(row.McrcoAutomovilesModelo);
		    expect(value.McrcoAutomovilesAno).toBe(row.McrcoAutomovilesAno);
		    expect(value.McrcoAutomovilesClase).toBe(row.McrcoAutomovilesClase);
		    expect(value.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar).toBe(row.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar);
		    expect(value.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega).toBe(row.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega);
		    expect(value.McrcoAutomovilesEstado).toBe(row.McrcoAutomovilesEstado);
            done();
        });
    });

    it('#save-update should return 404 Not found', (done: DoneFn) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Not Found',
            status: 404,
            statusText: 'Not Found'
        });

        httpClientSpy.patch.and.returnValue(asyncError(errorResponse));

        let row = new McrcoAutomovilesModel({});
        row.McrcoAutomovilesId = -1;

        row._estado = 'O';

        //Update - McrcoAutomoviles
        service.save(row, row).subscribe(
            (value) => {
                expect((<any>value).statusText).toEqual("Not Found");
                expect((<any>value).status).toEqual(404);
                done();
            },
            (error) => {
                fail(`expected an error for update, not McrcoAutomovilesModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });


    it('#delete should return null', (done: DoneFn) => {
        httpClientSpy.delete.and.returnValue(asyncData(true));

        let row = new McrcoAutomovilesModel(rowBase);
        row._estado = 'O';
        delete row.McrcoAutomovilesId;

        //Delete - McrcoAutomoviles
        service.delete(row).subscribe(value => {
            expect(value).toBe(true);
            done();
        });
    });

    it('#delete should return 404 Not found', (done: DoneFn) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Not Found',
            status: 404,
            statusText: 'Not Found'
        });

        httpClientSpy.delete.and.returnValue(asyncError(errorResponse));

        let row = new McrcoAutomovilesModel({});
        row._estado = 'O';
        row.McrcoAutomovilesId = -1;

        //Delete - McrcoAutomoviles
        service.delete(row).subscribe(value => {
            expect(value.statusText).toEqual("Not Found");
            expect(value.status).toEqual(404);
            done();
        });
    });

    it('#filterMcrcoSucursalesDescripcionReclamar should return value from observable', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData({value : [rowBase.McrcoSucursalesReclamar]}));

        service.filterMcrcoSucursalesDescripcionReclamar(`Cartagena - Centro`).subscribe(value => {
            expect(value?.value?.length).toBe(1);
            expect(value.value[0].McrcoSucursalesDescripcionReclamar).toBe(`Cartagena - Centro`);
            done();
        });
    });

    it('#getByIdMcrcoSucursalesDescripcionReclamar should return One Row', (done: DoneFn) => {
        let row = rowBase.McrcoSucursalesReclamar;

        httpClientSpy.get.and.returnValue(asyncData(row));

        service.getByIdMcrcoSucursalesDescripcionReclamar(row.McrcoSucursalesId).subscribe((value) => {
		    expect(value.McrcoSucursalesId).toBe(row.McrcoSucursalesId);
			expect(value.McrcoSucursalesDescripcion).toBe(row.McrcoSucursalesDescripcion);
            done();
        });
    });

    it('#getByIdMcrcoSucursalesDescripcionReclamar should return 404 Not found', (done: DoneFn) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Not Found',
            status: 404,
            statusText: 'Not Found'
        });

        httpClientSpy.get.and.returnValue(asyncError(errorResponse));

        let row = rowBase.McrcoSucursalesReclamar;

        service.getByIdMcrcoSucursalesDescripcionReclamar(row.McrcoSucursalesId).subscribe(
            (value) => {
                console.log(`#getByIdMcrcoSucursalesDescripcionReclamar.Error: ${JSON.stringify(value)}`);
                expect(value.statusText).toEqual('Not Found')
                expect(value.status).toBe(404)
                done();
            },
            (error) => {
                fail(`expected an error, not McrcoSucursalesModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });


    it('#filterMcrcoSucursalesDescripcionEntrega should return value from observable', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData({value : [rowBase.McrcoSucursalesEntrega]}));

        service.filterMcrcoSucursalesDescripcionEntrega(`Barranuilla - San Jose`).subscribe(value => {
            expect(value?.value?.length).toBe(1);
            expect(value.value[0].McrcoSucursalesDescripcionEntrega).toBe(`Barranuilla - San Jose`);
            done();
        });
    });

    it('#getByIdMcrcoSucursalesDescripcionEntrega should return One Row', (done: DoneFn) => {
        let row = rowBase.McrcoSucursalesEntrega;

        httpClientSpy.get.and.returnValue(asyncData(row));

        service.getByIdMcrcoSucursalesDescripcionEntrega(row.McrcoSucursalesId).subscribe((value) => {
		    expect(value.McrcoSucursalesId).toBe(row.McrcoSucursalesId);
			expect(value.McrcoSucursalesDescripcion).toBe(row.McrcoSucursalesDescripcion);
            done();
        });
    });

    it('#getByIdMcrcoSucursalesDescripcionEntrega should return 404 Not found', (done: DoneFn) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Not Found',
            status: 404,
            statusText: 'Not Found'
        });

        httpClientSpy.get.and.returnValue(asyncError(errorResponse));

        let row = rowBase.McrcoSucursalesEntrega;

        service.getByIdMcrcoSucursalesDescripcionEntrega(row.McrcoSucursalesId).subscribe(
            (value) => {
                console.log(`#getByIdMcrcoSucursalesDescripcionEntrega.Error: ${JSON.stringify(value)}`);
                expect(value.statusText).toEqual('Not Found')
                expect(value.status).toBe(404)
                done();
            },
            (error) => {
                fail(`expected an error, not McrcoSucursalesModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });

});
