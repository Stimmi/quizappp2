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
  subscriptionRounds: Subscription;
  correctionsList;
  corrections;
  rounds;

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

    this.subscriptionCorrections = this.db.getCorrections().subscribe(corrections => this.processCorrections(corrections));

    this.subscriptionRounds = this.db.getRounds().subscribe(rounds => this.processRounds(rounds));

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
    this.corrections = corrections;

    if(this.rounds) {
      this.createCorrectionsList();
    }    



  }

  processRounds(rounds) {
    console.log(rounds);
    this.rounds = rounds;
    if(this.corrections) {
      this.createCorrectionsList();

    }

  }

  createCorrectionsList() {


    this.correctionsList = this.rounds;

    for (let index = 0; index < this.correctionsList.length; index++) {
      for (let indexx = 0; indexx < this.correctionsList[index].answers.length; indexx++) {


        if(this.corrections[this.correctionsList[index].number-1].corrections[indexx]) {

          this.correctionsList[index].answers[indexx].corrections = this.corrections[this.correctionsList[index].number-1].corrections[indexx].correction;
        
        }
        
      }
      
    }



  }

}
