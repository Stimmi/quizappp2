import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-registrations',
  templateUrl: './registrations.component.html',
  styleUrls: ['./registrations.component.scss']
})
export class RegistrationsComponent implements OnInit, OnDestroy {

  subscriptionRegistrations: Subscription
  registrations;

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

    this.db.getRegistrations().subscribe(reg => this.processRegistrations(reg));

  }

  ngOnDestroy() {
    if(this.subscriptionRegistrations) {
      this.subscriptionRegistrations.unsubscribe();
    }
  }

  processRegistrations(registrations) {
    this.registrations = registrations;
  }
 
}
