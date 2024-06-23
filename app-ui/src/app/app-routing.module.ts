import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/authentication/auth.guard';
import { ShellComponent } from './core/shell/shell.component';
// import { KeyCloakLoginComponent } from './path/to/KeyCloakLoginComponent'; // Import the KeyCloakLoginComponent class

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'room',
        loadChildren: () => import('./modules/room/room.module').then((m) => m.RoomModule),
      },
      // {
      //   path: 'keycloak-login',
      //   component: KeyCloakLoginComponent,
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
