import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { TokenData, AuthenticationService } from '../../authentication/authentication.service';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environment';
import { KeycloakService } from 'keycloak-angular';

interface NavListItem {
  icon: string;
  route: string;
  name: string;
}

@Component({
  selector: 'app-nav-list',
  templateUrl: './nav-list.component.html',
  styleUrls: ['./nav-list.component.scss'],
  standalone: true,
  imports: [RouterLinkActive, RouterLink, MatIconModule],
})
export class NavListComponent implements OnInit {
  @Input()
  device!: String;

  tokenData: TokenData;

  commonItems: NavListItem[] = [
    { icon: 'home', route: 'home', name: 'Home' },
    { icon: 'settings', route: 'room', name: 'Rooms' },
  ];

  mobileItems: NavListItem[] = [...this.commonItems];

  normalItems: NavListItem[] = [...this.commonItems];

  constructor(
    private router: Router,
    private keycloakService: KeycloakService,
    private authService: AuthenticationService
  ) {
    this.tokenData = this.authService.getTokenData();
  }
  ngOnInit(): void {}

  logout() {
    debugger;
    this.keycloakService.logout().then(() => {
      console.log('logged out');
      localStorage.removeItem('token');
      localStorage.removeItem('tokenData');
      this.keycloakService.clearToken();
    });
  }
}
