import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material-module/material-module.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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
  exports: [
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    TimeConversionPipe,
    SafeHtmlPipe,
    LayoutComponent,
    LayoutItemComponent,
    RunScriptsDirective,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TimeConversionPipe,
    SafeHtmlPipe,
    RunScriptsDirective,
    ConfirmDialogComponent,
    DisplayDetailsComponent,
    LayoutComponent,
    LayoutItemComponent,
    LayoutItemDirective,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
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
