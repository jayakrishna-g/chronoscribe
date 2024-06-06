import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/authentication/auth.guard';
import { LoginComponent } from './core/login/login.component';
import { PasswordResetComponent } from './core/login/password-reset/password-reset.component';
import { ShellComponent } from './core/shell/shell.component';

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
        path: 'products',
        loadChildren: () => import('./modules/products/products.module').then((m) => m.ProductsModule),
      },
      {
        path: 'transcription',
        loadChildren: () =>
          import('./modules/live-transcription/live-transcription.module').then((m) => m.LiveTranscriptionModule),
      },
      {
        path: 'room',
        loadChildren: () => import('./modules/room/room.module').then((m) => m.RoomModule),
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: LoginComponent,
  },
  {
    path: 'EditPass',
    component: PasswordResetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
