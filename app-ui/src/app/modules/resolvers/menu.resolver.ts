import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Menu } from 'src/app/shared/types/menuTypes';
import { MenuService } from '../menu/menu-service/menu-service.service';

@Injectable({
  providedIn: 'root',
})
export class MenuResolver  {
  constructor(private menuService: MenuService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Menu> {
    return this.menuService.getMenu(route.paramMap.get('id') || '');
  }
}
