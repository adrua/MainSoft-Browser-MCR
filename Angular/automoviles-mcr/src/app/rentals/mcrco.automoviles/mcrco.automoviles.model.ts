export enum EnumMcrcoAutomovilesEstado {
  'Disponible' = '1',
  'Mantenimiento' = '2',
  'Fuera_de_servicio' = '3'
}

export class McrcoAutomovilesModel {
    public McrcoAutomovilesId: number = 0;
    public McrcoAutomovilesFechaIngreso: Date = new Date();
    public McrcoAutomovilesMarca: string;
    public McrcoAutomovilesModelo: string;
    public McrcoAutomovilesAno: number;
    public McrcoAutomovilesClase: string;
    public McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar: number;
    public McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega: number;
    public McrcoAutomovilesEstado: string = 'Disponible';
    public McrcoSucursalesReclamar?: any = {};
    public McrcoSucursalesEntrega?: any = {};
    public _secuencia?: number = 0;
    public _estado?: string = 'N';
    public _id?: string = '';
    public _v?: number = 0;

    constructor(json?: any) {
        if(json) {
            this.McrcoAutomovilesId = json.McrcoAutomovilesId;
            this.McrcoAutomovilesFechaIngreso = json.McrcoAutomovilesFechaIngreso;
            this.McrcoAutomovilesMarca = json.McrcoAutomovilesMarca;
            this.McrcoAutomovilesModelo = json.McrcoAutomovilesModelo;
            this.McrcoAutomovilesAno = json.McrcoAutomovilesAno;
            this.McrcoAutomovilesClase = json.McrcoAutomovilesClase;
            this.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = json.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar;
            this.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = json.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega;
            this.McrcoAutomovilesEstado = json.McrcoAutomovilesEstado;
            this.McrcoSucursalesReclamar = json.McrcoSucursalesReclamar;
            this.McrcoSucursalesEntrega = json.McrcoSucursalesEntrega;
        }
    }

    static clone(row: McrcoAutomovilesModel): McrcoAutomovilesModel {
        const rowCloned = Object.assign({}, row);

        delete rowCloned._secuencia;
        delete rowCloned._estado;
        delete rowCloned._id;
        delete rowCloned._v;
        delete rowCloned.McrcoSucursalesReclamar;
        delete rowCloned.McrcoSucursalesEntrega;

        return rowCloned;
    }

    static cloneExcel(data: McrcoAutomovilesModel[]): any[] {
       const dataExcel: any[] = [];
       data.forEach(dato => {
           const registro = {

              McrcoAutomovilesId: dato.McrcoAutomovilesId,
              McrcoAutomovilesFechaIngreso: dato.McrcoAutomovilesFechaIngreso,
              McrcoAutomovilesMarca: dato.McrcoAutomovilesMarca,
              McrcoAutomovilesModelo: dato.McrcoAutomovilesModelo,
              McrcoAutomovilesAno: dato.McrcoAutomovilesAno,
              McrcoAutomovilesClase: dato.McrcoAutomovilesClase,
              McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar: dato.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar,
              McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega: dato.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega,
              McrcoAutomovilesEstado: dato.McrcoAutomovilesEstado,
              McrcoSucursalesReclamar:  dato.McrcoSucursalesReclamar,
              McrcoSucursalesEntrega:  dato.McrcoSucursalesEntrega

            };
            dataExcel.push(registro);
       });
       return dataExcel;
    }

    toClipboard(separator: string = '\t'): string {
        let result = '';

        result += `${separator}${this.McrcoAutomovilesId}`;
        result += `${separator}${this.McrcoAutomovilesFechaIngreso}`;
        result += `${separator}${this.McrcoAutomovilesMarca}`;
        result += `${separator}${this.McrcoAutomovilesModelo}`;
        result += `${separator}${this.McrcoAutomovilesAno}`;
        result += `${separator}${this.McrcoAutomovilesClase}`;
        result += `${separator}${this.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar}`;
        result += `${separator}${this.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega}`;
        result += `${separator}${this.McrcoAutomovilesEstado}`;

        return result.substring(separator.length);
    }

    fromClipboard(value: string, separator: string = '\t'): McrcoAutomovilesModel {
        const result = value.split(separator);

        this.McrcoAutomovilesId = parseInt(result[0], 10);
        this.McrcoAutomovilesFechaIngreso = new Date(result[1]);
        this.McrcoAutomovilesMarca = result[2];
        this.McrcoAutomovilesModelo = result[3];
        this.McrcoAutomovilesAno = parseInt(result[4], 10);
        this.McrcoAutomovilesClase = result[5];
        this.McrcoSucursalesIdMcrcoSucursalesDescripcionReclamar = parseInt(result[6], 10);
        this.McrcoSucursalesIdMcrcoSucursalesDescripcionEntrega = parseInt(result[7], 10);
        this.McrcoAutomovilesEstado = result[8];

        return this;
    }

}
