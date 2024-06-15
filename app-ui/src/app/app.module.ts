import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShellComponent } from './core/shell/shell.component';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './core/login/login.component';
import { AuthenticationService } from './core/authentication/authentication.service';
import { ToastrModule } from 'ngx-toastr';
import { PasswordResetComponent } from './core/login/password-reset/password-reset.component';
import { MobileShellComponent } from './core/shell/mobile-shell/mobile-shell.component';
import { NormalShellComponent } from './core/shell/normal-shell/normal-shell.component';
import { NavListComponent } from './core/shell/nav-list/nav-list.component';
import { TitleBarComponent } from './core/shell/title-bar/title-bar.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, SharedModule.forRoot(), ToastrModule.forRoot(), ShellComponent,
        LoginComponent,
        PasswordResetComponent,
        MobileShellComponent,
        NormalShellComponent,
        NavListComponent,
        TitleBarComponent],
    providers: [AuthenticationService],
    bootstrap: [AppComponent],
})
export class AppModule {}
