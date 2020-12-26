import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DatabaseService } from './services/database.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  currentTeam;
  adminUsers;

  constructor(private db: DatabaseService, private router:Router){

    this.db.currentTeam.subscribe(currentTeam => {this.currentTeam = currentTeam});
    this.db.currentAdminUsers.subscribe(adminUsers => {this.adminUsers = adminUsers});


  };

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


      if(this.adminUsers.includes(this.currentTeam)) {
        return true;
      } else {
        return this.router.navigate(['registreer']);
      }

  }
  
}


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  currentTeam;
  subscriptionCurrentTeam: Subscription;

  constructor(private db: DatabaseService, private router:Router){

    this.subscriptionCurrentTeam = this.db.currentTeam.subscribe(currentTeam => {this.currentTeam = currentTeam});

  };

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


      if(this.currentTeam) {
        return true;

      } else {
        return this.router.navigate(['registreer']);
      }

  }
  
}