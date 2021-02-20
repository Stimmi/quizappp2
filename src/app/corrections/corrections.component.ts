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
  subscriptionTeams: Subscription;
  correctionsList;
  filteredList = [];
  corrections;
  rounds;
  roundsCorrected: number = 0;
  teams = [{name: "Ploeg"}];

  roundNumbers = ['Ronde',1,2,3,4,5,6,7];
  checked = ['Verbeterd', 'Ja', 'Nee'];

  filterForm = new FormGroup({
    roundNumbersControl: new FormControl('Ronde'),
    teamsControl: new FormControl('Ploeg'),
    checkedControl: new FormControl('Verbeterd')

  });

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

    this.subscriptionCorrections = this.db.getCorrections().subscribe(corrections => this.processCorrections(corrections));
    this.subscriptionRounds = this.db.currentRounds.subscribe(rounds => this.processRounds(rounds));
    this.subscriptionTeams = this.db.currentTeams.subscribe(teams => this.processTeams(teams));

  }


  ngOnDestroy(): void {

    if(this.subscriptionCorrections) {
      this.subscriptionCorrections.unsubscribe();
    }
    if(this.subscriptionRounds) {
      this.subscriptionRounds.unsubscribe();
    }
    if(this.subscriptionTeams) {
      this.subscriptionTeams.unsubscribe();
    }
  }

  processCorrections(corrections) {


    if (corrections) {
      this.corrections = [];

      // Sort the corrections based on the round number
      for (let index = 0; index < corrections.length; index++) {
        this.corrections[corrections[index].number-1] = corrections[index];
      }

      if(this.rounds) {
        this.createCorrectionsList();
      }   

    }

 

  }

  processRounds(rounds) {

    if(rounds) {
      this.rounds = rounds;

      // Count the number of rounds that are corrected
      this.roundsCorrected = 0;

      for (let index = 0; index < this.rounds.length; index++) {
        if(this.rounds[index].score) {
          this.roundsCorrected++          
        }
      }

      if(this.corrections) {
        this.createCorrectionsList();
      }
    }

  }

  processTeams(teamsDb: any[]) {

    this.teams = [{name: "Ploeg"}];

    for (let index = 0; index < teamsDb.length; index++) {
      this.teams.push(teamsDb[index])
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

    /*// If the filtered list is empty, the complete list can be assigned
    if(!this.filteredList) {
      this.filteredList = this.correctionsList;
    }*/

  }

  autoCorrect(answer: string, corrections: string[]): boolean {

    var autoCorrect = false;

    // Trim all answers and set to lower case
    answer = answer.toString().toLowerCase().trim();

    // Check if the answer matches one of the options in the array
    if(corrections.includes(answer)){
      autoCorrect = true;
    };

    // check if correction 0 is a part of the answer
    if(answer.includes(corrections[0])) {
      autoCorrect = true;
    };

    return autoCorrect;
  }

  onSubmit() {

    this.filterCorrectionsList(this.filterForm.value)
    
  }

  filterCorrectionsList(formInput) {

    var inbetweenList = [];
    var inbetweenListTwo = [];
    this.filteredList = [];


    // Check each parameter and pass on a filtered list
    // Check on the round number
    if(formInput.roundNumbersControl == 'Ronde') {
      inbetweenList = this.correctionsList
    } else  {
      for (let index = 0; index < this.correctionsList.length; index++) {
        if(this.correctionsList[index].number == formInput.roundNumbersControl) {
          inbetweenList.push(this.correctionsList[index]);
        }
      }
    }
    // Check on the selected team
    if(formInput.teamsControl == 'Ploeg') {
      inbetweenListTwo = inbetweenList;
    } else {
      for (let index = 0; index < inbetweenList.length; index++) {
        if(inbetweenList[index].team == formInput.teamsControl) {
          inbetweenListTwo.push(inbetweenList[index])
        }
      }
    }

    // Check on the corrected parameter
    if(formInput.checkedControl == 'Verbeterd') {
      this.filteredList = inbetweenListTwo;
    } else {
      for (let index = 0; index < inbetweenListTwo.length; index++) {
        if(inbetweenListTwo[index].score && formInput.checkedControl == 'Ja') {
          this.filteredList.push(inbetweenListTwo[index]);
        }
        if(!inbetweenListTwo[index].score && formInput.checkedControl == 'Nee') {
          this.filteredList.push(inbetweenListTwo[index]);
        }
      }
    }

  }

  recalculateTotal(indexFromForm) {

    // When a checkbox is changed, the total of the round must be reculculated
    this.filteredList[indexFromForm].autoScore = 0;

    for (let index = 0; index < this.filteredList[indexFromForm].answers.length; index++) {
      if(this.filteredList[indexFromForm].answers[index].autoCorrect == true) {
        this.filteredList[indexFromForm].autoScore++
      }
    }

  }

  setScore(index) {
    let round = this.filteredList[index];

    //Check if the score is a valid number and commit to DB
    if(typeof round.autoScore == 'number') {

      this.filteredList[index].score = round.autoScore;
      this.db.setScore(round.id, round.autoScore);
      this.filterCorrectionsList(this.filterForm.value);

    } 


  }


}
