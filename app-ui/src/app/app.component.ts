import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router'; // Import Router module
import { KeycloakService } from 'keycloak-angular';
import { AuthenticationService } from './core/authentication/authentication.service';
import { KeycloakEventType } from 'keycloak-angular';
import { response } from 'express';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  title = 'ui';
  constructor(
    private keycloakService: KeycloakService,
    private authservice: AuthenticationService,
    private router: Router // Inject Router module
  ) {}

  verifyToken = async () => {
    try {
      const token = this.authservice.getToken();
      if (token) {
        if (this.authservice.jwtHelper.isTokenExpired(token)) {
          const newToken = await this.keycloakService.getToken();
          this.authservice.setToken(newToken);
        }
      }
    } catch (error) {
      // Handle error
    }
  };

  ngOnInit() {
    console.log('AppComponent ngOnInit');
    try {
      debugger;
      if (this.keycloakService.isLoggedIn()) {
        if (!this.authservice.isAuthenticated()) {
          this.keycloakService.getToken().then((token) => {
            console.log('token', token);

            this.authservice.verifyKeycloakToken(token).subscribe((response) => {
              if (response.status) {
                console.log('token verified', response);
                this.authservice.setToken(token);
                this.authservice.storeTokenData(token);
              }
            });
          });
        }
      }
      this.router.navigate(['home']);

      this.keycloakService.keycloakEvents$.subscribe((event) => {
        console.log('event', event);
        if (event.type === KeycloakEventType.OnTokenExpired) {
          this.keycloakService.getToken().then((token) => {
            this.authservice.setToken(token);
            this.authservice.storeTokenData(token);
          });
        }
      });
    } catch (error) {
      // Handle error
      console.log('error', error);
    }
  }

  async fetchToken() {
    try {
      const token = await this.keycloakService.getToken();
      this.authservice.setToken(token);
      console.log('toekn is', token);
      // Use the token here
    } catch (error) {
      // Handle error
    }
  }
}
