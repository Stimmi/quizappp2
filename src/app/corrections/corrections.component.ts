import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-corrections',
  templateUrl: './corrections.component.html',
  styleUrls: ['./corrections.component.scss']
})
export class CorrectionsComponent implements OnInit, OnDestroy {

  subscriptionCorrections: Subscription;
  subscriptionRounds: Subscription;
  correctionsList;
  corrections;
  rounds;

  roundNumbers = ['Ronde',1,2,3,4,5,6];
  teams = ['qdsf','dfsdf'];
  checked = ['Verbeterd', 'Ja', 'Nee'];

  filterForm = new FormGroup({
    roundNumbersControl: new FormControl('Ronde'),
    teamsControl: new FormControl(''),
    checkedControl: new FormControl('Verbeterd')

  });

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
    this.corrections = corrections;

    if(this.rounds) {
      this.createCorrectionsList();
    }    

  }

  processRounds(rounds) {
    this.rounds = rounds;
    if(this.corrections) {
      this.createCorrectionsList();

    }

  }

  createCorrectionsList() {


    this.correctionsList = this.rounds;

    // Loop over all rounds
    for (let index = 0; index < this.correctionsList.length; index++) {

      this.correctionsList[index].autoScore = 0;

      //Loop over all questions of this round
      for (let indexx = 0; indexx < this.correctionsList[index].answers.length; indexx++) {


        // If a correction exists, match it with the answer and make auto correction
        if(this.corrections[this.correctionsList[index].number-1].corrections[indexx]) {

          this.correctionsList[index].answers[indexx].corrections = this.corrections[this.correctionsList[index].number-1].corrections[indexx].correction;       
          let autoCorrectResult = this.autoCorrect(this.correctionsList[index].answers[indexx].answer, this.correctionsList[index].answers[indexx].corrections);
          
          if(autoCorrectResult) {
            this.correctionsList[index].answers[indexx].autoCorrect = true;
            this.correctionsList[index].autoScore++;
          } else {
            this.correctionsList[index].answers[indexx].autoCorrect = false;
          }


        }
        
      }
      
    }

    console.log(this.correctionsList)

  }

  autoCorrect(answer: string, corrections: string[]): boolean {

    var autoCorrect = false;

    answer = answer.toString().toLowerCase().trim();

    if(corrections.includes(answer)){
      autoCorrect = true;
    };

    if(answer.includes(corrections[0])) {
      autoCorrect = true;
    };

    return autoCorrect;
  }

  onSubmit() {

    console.log(this.filterForm.value);
    
  }


}
