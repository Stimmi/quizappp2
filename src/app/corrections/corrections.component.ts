import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-corrections',
  templateUrl: './corrections.component.html',
  styleUrls: ['./corrections.component.css']
})
export class CorrectionsComponent implements OnInit, OnDestroy {

  subscriptionCorrections: Subscription;
  subscriptionRounds: Subscription

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

    this.subscriptionCorrections = this.db.getCorrections().subscribe(corrections => this.processCorrections(corrections));

    this.subscriptionRounds = this.db.currentRounds.subscribe(rounds => this.processRounds(rounds));

  }


  ngOnDestroy(): void {

    if(this.subscriptionCorrections) {
      this.subscriptionCorrections.unsubscribe();
    }
    if(this.subscriptionRounds) {
      this.subscriptionRounds.unsubscribe();
    }

  }

  processCorrections(corrections) {
    console.log(corrections);
  }

  processRounds(corrections) {
    console.log(corrections);
  }

}
