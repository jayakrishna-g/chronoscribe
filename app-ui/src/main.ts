import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './app/shared/shared.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AuthenticationService } from './app/core/authentication/authentication.service';
import { APP_INITIALIZER } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keyCloakUrl,
        realm: environment.kyCloakRealm,
        clientId: environment.keyCloakClientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: false,
        redirectUri: environment.forntendAppUrl,
      },
      enableBearerInterceptor: true,
    });
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      SharedModule.forRoot(),
      ToastrModule.forRoot(),
      KeycloakAngularModule
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    AuthenticationService,
    provideAnimations(),
  ],
}).catch((err) => console.log(err));
