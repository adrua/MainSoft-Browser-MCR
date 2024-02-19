export enum EnumMcrcoSucursalesEstado {
  'Activo' = '1',
  'En_Mantenimiento' = '2',
  'Cerrado' = '3'
}

export class McrcoSucursalesModel {
    public McrcoSucursalesId: number = 0;
    public McrcoSucursalesFechaInicio: Date = new Date();
    public McrcoSucursalesDescripcion: string;
    public McrcoSucursalesDireccion: string;
    public CiudadDepartamentoId: number;
    public Ciudadid: number;
    public CntCiudadesComp: string;
    public McrcoSucursalesLongitud: number = 0.0;
    public McrcoSucursalesLatitud: number = 0.0;
    public McrcoSucursalesEstado: string = 'Activo';
    public CntCiudades?: any = {};
    public _secuencia?: number = 0;
    public _estado?: string = 'N';
    public _id?: string = '';
    public _v?: number = 0;

    constructor(json?: any) {
        if(json) {
            this.McrcoSucursalesId = json.McrcoSucursalesId;
            this.McrcoSucursalesFechaInicio = json.McrcoSucursalesFechaInicio;
            this.McrcoSucursalesDescripcion = json.McrcoSucursalesDescripcion;
            this.McrcoSucursalesDireccion = json.McrcoSucursalesDireccion;
            this.CiudadDepartamentoId = json.CiudadDepartamentoId;
            this.Ciudadid = json.Ciudadid;
            this.CntCiudadesComp =  json.CntCiudadesComp;
            this.McrcoSucursalesLongitud = json.McrcoSucursalesLongitud;
            this.McrcoSucursalesLatitud = json.McrcoSucursalesLatitud;
            this.McrcoSucursalesEstado = json.McrcoSucursalesEstado;
            this.CntCiudades = json.CntCiudades;
        }
    }

    static clone(row: McrcoSucursalesModel): McrcoSucursalesModel {
        const rowCloned = Object.assign({}, row);

        delete rowCloned._secuencia;
        delete rowCloned._estado;
        delete rowCloned._id;
        delete rowCloned._v;
        delete rowCloned.CntCiudades;

        return rowCloned;
    }

    static cloneExcel(data: McrcoSucursalesModel[]): any[] {
       const dataExcel: any[] = [];
       data.forEach(dato => {
           const registro = {

              McrcoSucursalesId: dato.McrcoSucursalesId,
              McrcoSucursalesFechaInicio: dato.McrcoSucursalesFechaInicio,
              McrcoSucursalesDescripcion: dato.McrcoSucursalesDescripcion,
              McrcoSucursalesDireccion: dato.McrcoSucursalesDireccion,
              CiudadDepartamentoId: dato.CiudadDepartamentoId,
              Ciudadid: dato.Ciudadid,
              CntCiudadesComp:  dato.CntCiudadesComp,
              McrcoSucursalesLongitud: dato.McrcoSucursalesLongitud,
              McrcoSucursalesLatitud: dato.McrcoSucursalesLatitud,
              McrcoSucursalesEstado: dato.McrcoSucursalesEstado,
              CntCiudades:  dato.CntCiudades

            };
            dataExcel.push(registro);
       });
       return dataExcel;
    }

    toClipboard(separator: string = '\t'): string {
        let result = '';

        result += `${separator}${this.McrcoSucursalesId}`;
        result += `${separator}${this.McrcoSucursalesFechaInicio}`;
        result += `${separator}${this.McrcoSucursalesDescripcion}`;
        result += `${separator}${this.McrcoSucursalesDireccion}`;
        result += `${separator}${this.CiudadDepartamentoId}`;
        result += `${separator}${this.Ciudadid}`;
        result += `${separator}${this.McrcoSucursalesLongitud}`;
        result += `${separator}${this.McrcoSucursalesLatitud}`;
        result += `${separator}${this.McrcoSucursalesEstado}`;

        return result.substring(separator.length);
    }

    fromClipboard(value: string, separator: string = '\t'): McrcoSucursalesModel {
        const result = value.split(separator);

        this.McrcoSucursalesId = parseInt(result[0], 10);
        this.McrcoSucursalesFechaInicio = new Date(result[1]);
        this.McrcoSucursalesDescripcion = result[2];
        this.McrcoSucursalesDireccion = result[3];
        this.CiudadDepartamentoId = parseInt(result[4], 10);
        this.Ciudadid = parseInt(result[5], 10);
        this.McrcoSucursalesLongitud = parseFloat(result[6]);
        this.McrcoSucursalesLatitud = parseFloat(result[7]);
        this.McrcoSucursalesEstado = result[8];

        return this;
    }

}
