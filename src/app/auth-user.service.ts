import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService implements CanActivate{

  token: string | null = null

  constructor(
    private router: Router
  ) { }

  canActivate(): boolean {
    if(this.token === null && localStorage.getItem('token') !== null) {
      this.token = localStorage.getItem('token')
    }

    if(this.token === null && localStorage.getItem('token') === null) {
      this.router.navigate(['/'])
    }

    return this.token !== null
  }
}
