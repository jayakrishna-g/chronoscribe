import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private keycloakService: KeycloakService, @Inject(Router) private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // if (!this.authService.isAuthenticated()) {
    //   this.router.navigate(['login']);
    // }
    // return true;
    if (!this.keycloakService.isLoggedIn()) {
      return false;
    }
    return true;
  }
}
