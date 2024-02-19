import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppMaterialModule } from './app.material.module';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { ArkeosComponentsModule, ArkeosSharedModule } from 'arkeos-components';
import { ArkeosPowerbuilderComponentsModule } from 'arkeos-powerbuilder-components';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './components/assets/i18n', '.json');
}

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        AppMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        }),
        ArkeosComponentsModule,
        ArkeosPowerbuilderComponentsModule,
        ArkeosSharedModule
    ],
    exports: [
        AppMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        CommonModule,
        FormsModule,
        ArkeosPowerbuilderComponentsModule,
        ArkeosComponentsModule,
        ArkeosSharedModule
    ],
    providers: []
})
export class SharedModule {

  constructor(translate: TranslateService) {
    translate.use('es');
  }
  
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [TranslateService]
    }
  }
}
