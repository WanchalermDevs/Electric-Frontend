import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthorizeService } from '../services/authorize.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthorizeService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.checkLogin(window.localStorage.getItem('username')).then(response => {
      if (response['operation'] === 'success') {
        if (window.localStorage.getItem('token') === response['token']) {
          return true;
        } else {
          window.localStorage.clear();
          console.log('goto Login Page');
          this.router.navigateByUrl('/pages/login');
        }
      } else {
        window.localStorage.clear();
      }
    });
  }
}
