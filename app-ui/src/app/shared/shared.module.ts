import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material-module/material-module.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from '../core/interceptors/api.interceptor';
import { TokenInterceptor } from '../core/interceptors/token.interceptor';
import { TimeConversionPipe } from './pipes/time-conversion.pipe';
import { NotificationInterceptor } from '../core/interceptors/notification.interceptor';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { RunScriptsDirective } from './directives/run-scripts.directive';
import { LoadingInterceptor } from '../core/interceptors/loading.interceptor';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DisplayDetailsComponent } from './components/display-details/display-details.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LayoutItemComponent } from './components/layout-item/layout-item.component';
import { LayoutItemDirective } from './components/layout-item/layout-item.directive';
@NgModule({
  declarations: [
    TimeConversionPipe,
    SafeHtmlPipe,
    RunScriptsDirective,
    ConfirmDialogComponent,
    DisplayDetailsComponent,
    LayoutComponent,
    LayoutItemComponent,
    LayoutItemDirective,
  ],
  imports: [CommonModule, MaterialModule, FlexLayoutModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    TimeConversionPipe,
    SafeHtmlPipe,
    LayoutComponent,
    LayoutItemComponent,
    RunScriptsDirective,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: NotificationInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingInterceptor,
          multi: true,
        },
      ],
    };
  }
}
