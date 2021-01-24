import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';


@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit, OnDestroy {

  subscriptionRoundsControl: Subscription;
  roundsControl: boolean[] = [];

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

    this.subscriptionRoundsControl = this.db.currentRoundsControl.subscribe(roundsControl => this.processRoundsControl(roundsControl));

  }
  ngOnDestroy() {
    if(this.subscriptionRoundsControl) {
      this.subscriptionRoundsControl.unsubscribe();
    }
  }


  processRoundsControl(roundsControl) {

    if(roundsControl.rounds) {

      this.roundsControl = roundsControl.rounds;

    }
  }

  changeToggle() {

    this.db.setRoundsControl(this.roundsControl);

  }

}
