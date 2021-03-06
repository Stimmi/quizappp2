import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { faSignOutAlt} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  faSignOutAlt = faSignOutAlt;

  navbarOpen = false;
  subscriptionAdminUsers: Subscription;
  subscriptionCurrentTeam: Subscription;

  adminUsers;
  adminMode = false;
  currentTeam;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  
  constructor(private db: DatabaseService, private router: Router) { }

  ngOnInit(): void {

    this.subscriptionCurrentTeam = this.db.currentTeam.subscribe(currentTeam => {this.currentTeam = currentTeam});

    this.subscriptionAdminUsers = this.db.currentAdminUsers.subscribe(adminUsers => this.processAdminUsers(adminUsers));

  }

  ngOnDestroy(): void {
    if(this.subscriptionAdminUsers) {
      this.subscriptionAdminUsers.unsubscribe();
    }
    if(this.subscriptionCurrentTeam) {
      this.subscriptionCurrentTeam.unsubscribe();
    }
  }

  processAdminUsers(adminUsers) {

    this.adminUsers = adminUsers;

    if(this.adminUsers.includes(this.currentTeam)) {
      this.adminMode = true;
    }

  }

  logOut() {
    this.db.changeCurrentTeam(null);
    localStorage.removeItem("currentTeam");
    this.router.navigate(['registreer'])
  }

}
