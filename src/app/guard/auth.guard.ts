import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public afAuth: AngularFireAuth,
    public userService: UserService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean>{
    return await new Promise((resolve, reject) => {
      this.userService.getCurrentUser()
      .then(user => {
        return resolve(true);
      }, err => {
        this.router.navigate(['login']);
        return resolve(false);
      })
    })
  }
}
