// McrcoSucursales - Service - Angular Testing
import { asyncData, asyncError } from '../../../testing/async-observable-helpers';
import { HttpErrorResponse } from '@angular/common/http';

import { McrcoSucursalesModel, EnumMcrcoSucursalesEstado } from './mcrco.sucursales.model';
import { McrcoSucursalesService } from './mcrco.sucursales.service';


describe('McrcoSucursalesService', () => {
    let httpClientSpy: {
      get: jasmine.Spy,
      post: jasmine.Spy,
      put: jasmine.Spy,
      patch: jasmine.Spy,
      delete: jasmine.Spy
    };

    let service: McrcoSucursalesService;

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

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'patch', 'delete']);
        service = new McrcoSucursalesService(httpClientSpy as any, 'https://localhost', true);
    });

    it('#getById should return One Row', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData(rowBase));

        let row = new McrcoSucursalesModel(rowBase);

        service.getById(row.McrcoSucursalesId).subscribe((value) => {
		    expect(value.McrcoSucursalesId).toBe(row.McrcoSucursalesId);
		    expect(new Date(value.McrcoSucursalesFechaInicio)).toEqual(row.McrcoSucursalesFechaInicio);
		    expect(value.McrcoSucursalesDescripcion).toBe(row.McrcoSucursalesDescripcion);
		    expect(value.McrcoSucursalesDireccion).toBe(row.McrcoSucursalesDireccion);
		    expect(value.CiudadDepartamentoId).toBe(row.CiudadDepartamentoId);
		    expect(value.Ciudadid).toBe(row.Ciudadid);
		    expect(value.McrcoSucursalesLongitud).toBe(row.McrcoSucursalesLongitud);
		    expect(value.McrcoSucursalesLatitud).toBe(row.McrcoSucursalesLatitud);
		    expect(value.McrcoSucursalesEstado).toBe(row.McrcoSucursalesEstado);
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

        let row = new McrcoSucursalesModel(rowBase);

        service.getById(row.McrcoSucursalesId).subscribe((value) => {
                console.log(`#getById.Error: ${JSON.stringify(value)}`);
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

        let row = new McrcoSucursalesModel(rowBase);
        row._estado = 'N';
        delete row.McrcoSucursalesId;

        //Add - McrcoSucursales
        service.save(row, row).subscribe(value => {
		    expect(new Date(value.McrcoSucursalesFechaInicio)).toEqual(row.McrcoSucursalesFechaInicio);
		    expect(value.McrcoSucursalesDescripcion).toBe(row.McrcoSucursalesDescripcion);
		    expect(value.McrcoSucursalesDireccion).toBe(row.McrcoSucursalesDireccion);
		    expect(value.CiudadDepartamentoId).toBe(row.CiudadDepartamentoId);
		    expect(value.Ciudadid).toBe(row.Ciudadid);
		    expect(value.McrcoSucursalesLongitud).toBe(row.McrcoSucursalesLongitud);
		    expect(value.McrcoSucursalesLatitud).toBe(row.McrcoSucursalesLatitud);
		    expect(value.McrcoSucursalesEstado).toBe(row.McrcoSucursalesEstado);
            done();
        });
    });

    it('#save-Update should return a updated row', (done: DoneFn) => {
        httpClientSpy.patch.and.returnValue(asyncData(rowBase));

        let row = new McrcoSucursalesModel(rowBase);
        row._estado = 'O';
        delete row.McrcoSucursalesId;

        //Update - McrcoSucursales
        service.save(row, row).subscribe(value => {
		    expect(new Date(value.McrcoSucursalesFechaInicio)).toEqual(row.McrcoSucursalesFechaInicio);
		    expect(value.McrcoSucursalesDescripcion).toBe(row.McrcoSucursalesDescripcion);
		    expect(value.McrcoSucursalesDireccion).toBe(row.McrcoSucursalesDireccion);
		    expect(value.CiudadDepartamentoId).toBe(row.CiudadDepartamentoId);
		    expect(value.Ciudadid).toBe(row.Ciudadid);
		    expect(value.McrcoSucursalesLongitud).toBe(row.McrcoSucursalesLongitud);
		    expect(value.McrcoSucursalesLatitud).toBe(row.McrcoSucursalesLatitud);
		    expect(value.McrcoSucursalesEstado).toBe(row.McrcoSucursalesEstado);
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

        let row = new McrcoSucursalesModel({});
        row.McrcoSucursalesId = -1;

        row._estado = 'O';

        //Update - McrcoSucursales
        service.save(row, row).subscribe(
            (value) => {
                expect((<any>value).statusText).toEqual("Not Found");
                expect((<any>value).status).toEqual(404);
                done();
            },
            (error) => {
                fail(`expected an error for update, not McrcoSucursalesModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });


    it('#delete should return null', (done: DoneFn) => {
        httpClientSpy.delete.and.returnValue(asyncData(true));

        let row = new McrcoSucursalesModel(rowBase);
        row._estado = 'O';
        delete row.McrcoSucursalesId;

        //Delete - McrcoSucursales
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

        let row = new McrcoSucursalesModel({});
        row._estado = 'O';
        row.McrcoSucursalesId = -1;

        //Delete - McrcoSucursales
        service.delete(row).subscribe(value => {
            expect(value.statusText).toEqual("Not Found");
            expect(value.status).toEqual(404);
            done();
        });
    });

    it('#filterCiudadNombreCiudad should return value from observable', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData({value : [rowBase.CntCiudades]}));

        service.filterCiudadNombreCiudad(`Barranquilla`).subscribe(value => {
            expect(value?.value?.length).toBe(1);
            expect(value.value[0].CiudadNombreCiudad).toBe(`Barranquilla`);
            done();
        });
    });

    it('#getByIdCiudadNombreCiudad should return One Row', (done: DoneFn) => {
        let row = rowBase.CntCiudades;

        httpClientSpy.get.and.returnValue(asyncData(row));

        service.getByIdCiudadNombreCiudad(row.CiudadDepartamentoId, row.Ciudadid).subscribe((value) => {
		    expect(value.CiudadDepartamentoId).toBe(row.CiudadDepartamentoId);
		    expect(value.Ciudadid).toBe(row.Ciudadid);
			expect(value.CiudadNombreCiudad).toBe(row.CiudadNombreCiudad);
            done();
        });
    });

    it('#getByIdCiudadNombreCiudad should return 404 Not found', (done: DoneFn) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Not Found',
            status: 404,
            statusText: 'Not Found'
        });

        httpClientSpy.get.and.returnValue(asyncError(errorResponse));

        let row = rowBase.CntCiudades;

        service.getByIdCiudadNombreCiudad(row.CiudadDepartamentoId, row.Ciudadid).subscribe(
            (value) => {
                console.log(`#getByIdCiudadNombreCiudad.Error: ${JSON.stringify(value)}`);
                expect(value.statusText).toEqual('Not Found')
                expect(value.status).toBe(404)
                done();
            },
            (error) => {
                fail(`expected an error, not CntCiudadesModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });

});
