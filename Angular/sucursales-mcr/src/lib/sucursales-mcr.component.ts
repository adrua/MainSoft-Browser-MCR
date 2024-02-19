import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

declare var readOnly: boolean;
declare var conditionsLists: any;
declare var idioma: string;
declare var idiomas: Array<any>;

@Component({
  selector: 'lib-sucursales-mcr',
  template: `
  <!-- Navbar -->
<!--<navbar-component></navbar-component>-->

<div>
    <!-- Navbar -->
    <mat-toolbar class="sticky-top" style="z-index: 10000; min-height: 46px !important;">
      <mat-toolbar-row class="bg-color-gold wh">
        
        <mat-icon (click)="onCambiarIconoMenu()" class="mr-1 wh" style="cursor: pointer;">{{ tipoLogoMenu }}</mat-icon>
        <span *ngIf="!isMenu" (click)="onVolverMenu()" class="text-sc">{{ modDescripcion }} > {{ grupoDescripcion }} ></span>
        <h3 *ngIf="!isMenu" (click)="onVolverMenu()" class="text-pr">{{ funcDescripcion }}</h3>

        <span style="flex: 1 1 auto;"></span>
        <mat-icon (click)="onBusqueda()" class="wh">search</mat-icon>
        <button mat-button style="padding: 0 !important;" [matMenuTriggerFor]="menuUser">
          <span class="mx-2" style="text-transform: capitalize;">{{ usuario.given_name }}</span>
          <mat-icon>keyboard_arrow_down</mat-icon>
        </button>
        
        <!-- Menu Usuario -->
        <mat-menu #menuUser="matMenu">
          <button mat-menu-item (click)="onCambiarClave()">
            <mat-icon>person_outline</mat-icon>
            <span>{{ 'home._cambiarClave' | translate }}</span>
          </button>
          <button mat-menu-item (click)="onCerrarSesion();">
            <mat-icon>power_settings_new</mat-icon>
            <span>{{ 'home._cerrarSesion' | translate }}</span>
          </button>
          <button mat-menu-item (click)="onCambiarIdioma(_idioma.id);" 
              *ngFor="let _idioma of _idiomas">
            <img src="/assets/images/iconos/{{ _idioma.icon }}"/>
            <span>{{ 'home.' + _idioma.name | translate }}</span>
          </button>
        </mat-menu>
      </mat-toolbar-row>
    </mat-toolbar>
</div> 
<div>   
    <mcrco-sucursales-table></mcrco-sucursales-table>
</div>
  `,
  styles: [`
.mat-table {
  overflow-x: scroll;
  width: 200vh !important;
}

.mat-cell,
.mat-header-cell {
  word-wrap: initial;
  display: table-cell;
  padding: 0px 10px;
  line-break: unset;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  vertical-align: middle;
}

.mat-row,
.mat-header-row {
  display: table-row;
}  `]
})
export class SucursalesMcrComponent  {
  show = false;
  
  opened: boolean = false;
  tipoLogoMenu: string = 'menu';
  altoVentana: string = '';

  modulos = [];
  grupos = [];
  funcionalidades = [];

  _idiomas = [
      {
        id: 'es',
        name: '_español',
        icon: 'ES.png'
      },
      {
        id: 'en',
        name: '_ingles',
        icon: 'US.png'
      },
    ];

  get usuario(): any {     
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser') || "{}");
    return { given_name: currentUser.name || 'Pruebas Unitarias'};
  }

  get isInicio(): boolean {
    //Respuesta Mock
    var yaInicio = 'true';//sessionStorage.getItem("yaInicio");
    var _yaInicio = yaInicio != null && yaInicio == 'true';

    return _yaInicio;
  }

  get isLogin(): boolean {
    //Respuesta Mock
    var estaLogueado = 'true'; //sessionStorage.getItem("estaLogueado");
    var _isLogin = estaLogueado != null && estaLogueado == 'true';

    return _isLogin;
  }

  get isMenu(): boolean {
    let sIsMenu = 'true';
    return sIsMenu === 'true';
  }

  modDescripcion: string = '';
  modNombre: string = '';
  modId: number = 0;
  grupoDescripcion: string = '';
  grupoNombre: string = '';
  grupoId: number = 0;
  funcDescripcion: string = '';
  funcNombre: string = '';

  _grupo: boolean = false;
  _funcionalidad: boolean = false;
  language = 'es-mcrco-sucursales-638439352758685202';

  constructor(readonly translate: TranslateService) { 
        console.log('Sucursalesmcr - mcrco-sucursales');
        // load translations from server and update translations
        //this.translateService.loadTranslation(language).subscribe(response => {
        //    this.localStorageService.setItem('translations', JSON.stringify(response.data));
        //    translate.setTranslation(language, response.data);
            translate.use(this.language);  
        //});
   }

   public hide() {
	    this.show = false;
   }

  ngOnInit() {
  }

  setModulos() {
  }

  onVolverMenu() {
  }

  onNavegacion(navegacion: any) {
  }

  onCambiarIconoMenu() {
    if (this.tipoLogoMenu == 'more_vert') {
      this.tipoLogoMenu = 'menu';
      this.opened = false;
    } else {
      this.tipoLogoMenu = 'more_vert';
      this.opened = true;
    }
  }

  onSelectModulo(modulo: any) {
  }

  onSelectGrupo(grupo: any) {
  }

  onSelectFuncionalidad(modulo: any, grupo: any, funcionalidad: any) {
  }

  onBusqueda() {
  }

  onCambiarClave() {
    // this.dialog.open(LOGIN_CambioClave_Dialog);
  }

  onCerrarSesion() {
  }

  onCambiarIdioma(_idioma: string) {
    //idioma = _idioma;
    
    this.translate.use((_idioma === 'es') ? this.language : _idioma);
    
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    for(var key in conditionsLists) {
      conditionsLists[key].map((x: any) => this.translate.get(`CONDITIONS_LIST_${key.toUpperCase()}.${x.value}`).subscribe((res: string) => {
        x.label = res;
      }));
    }  
  }

  navigationInterceptor(event: any): void {
  }

}
