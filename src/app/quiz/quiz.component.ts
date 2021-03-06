import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { StorageService } from '../services/storage.service';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, OnDestroy {

  // Font awesome icons
  faTimes = faTimes;

  // Sidebar handling
  statusSidebar: boolean = false;
  // Current Round handling
  currentRound = 1

  // Working with reactive forms check: https://angular.io/guide/reactive-forms
  round;
  rounds;
  currentTeam;
  subscriptionCurrentTeam: Subscription;
  subscriptionRounds: Subscription;
  subscriptionRoundsControl: Subscription;

  // Booleans to hide the submit button when a round is finished or already submitted
  // [0] = round 1 
  // [1] = round 2 
  // [2] = round 3
  // ...
  hideRounds: boolean[] = [false, false, false, false, false, false, false];
  roundsControl: boolean[] = [true, true, true, true, true, true, true];

  round1 = new FormGroup({
    1: new FormControl(''),
    2: new FormControl(''),
    3: new FormControl(''),
    4: new FormControl(''),
    5: new FormControl(''),
    6: new FormControl(''),
    7: new FormControl(''),
    8: new FormControl(''),
    9: new FormControl(''),
    10: new FormControl('')

  });

  round2 = new FormGroup({
    1: new FormControl(''),
    2: new FormControl(''),
    3: new FormControl(''),
    4: new FormControl(''),
    5: new FormControl(''),
    6: new FormControl(''),
    7: new FormControl(''),
    8: new FormControl(''),
    9: new FormControl(''),
    10: new FormControl(''),
    11: new FormControl(''),
    12: new FormControl(''),
    13: new FormControl(''),
    14: new FormControl(''),
    15: new FormControl(''),
    16: new FormControl(''),
    17: new FormControl(''),
    18: new FormControl(''),
    19: new FormControl(''),
    20: new FormControl(''),
    21: new FormControl(''),
    22: new FormControl(''),
    23: new FormControl(''),
    24: new FormControl(''),
    25: new FormControl(''),
    26: new FormControl('')
  });

  round3 = new FormGroup({
    1: new FormControl(''),
    2: new FormControl(''),
    3: new FormControl(''),
    4: new FormControl(''),
    5: new FormControl(''),
    6: new FormControl(''),
    7: new FormControl(''),
    8: new FormControl(''),
    9: new FormControl(''),
    10: new FormControl('')

  });

  round4 = new FormGroup({
    1: new FormControl(''),
    2: new FormControl(''),
    3: new FormControl(''),
    4: new FormControl(''),
    5: new FormControl(''),
    6: new FormControl(''),
    7: new FormControl(''),
    8: new FormControl(''),
    9: new FormControl(''),
    10: new FormControl(''),
    11: new FormControl(''),
    12: new FormControl(''),
    13: new FormControl('')


  });

  round5 = new FormGroup({
    1: new FormControl(''),
    2: new FormControl(''),
    3: new FormControl(''),
    4: new FormControl(''),
    5: new FormControl(''),
    6: new FormControl(''),
    7: new FormControl(''),
    8: new FormControl(''),
    9: new FormControl(''),
    10: new FormControl('')

  });

  round6 = new FormGroup({
    1: new FormControl(''),
    2: new FormControl(''),
    3: new FormControl(''),
    4: new FormControl(''),
    5: new FormControl(''),
    6: new FormControl(''),
    7: new FormControl(''),
    8: new FormControl(''),
    9: new FormControl(''),
    10: new FormControl(''),
    11: new FormControl(''),
    12: new FormControl(''),
    13: new FormControl(''),
    14: new FormControl(''),
    15: new FormControl(''),
    16: new FormControl(''),
    17: new FormControl(''),
    18: new FormControl(''),
    19: new FormControl(''),
    20: new FormControl(''),
    21: new FormControl(''),
    22: new FormControl(''),
    23: new FormControl(''),
    24: new FormControl(''),
    25: new FormControl(''),
    26: new FormControl(''),
    27: new FormControl(''),
    28: new FormControl(''),
    29: new FormControl(''),
    30: new FormControl('')
  });

  round7 = new FormGroup({
    1: new FormControl(''),
    2: new FormControl(''),
    3: new FormControl(''),
    4: new FormControl(''),
    5: new FormControl(''),
    6: new FormControl(''),
    7: new FormControl(''),
    8: new FormControl(''),
    9: new FormControl('')
  });

  constructor(private db: DatabaseService, private st: StorageService) { }

  ngOnInit(): void {

    this.subscriptionCurrentTeam = this.db.currentTeam
    .subscribe(currentTeam => {this.currentTeam = currentTeam});

    this.subscriptionRounds = this.db.currentRounds
    .subscribe(currentRounds => this.processRounds(currentRounds));

    this.subscriptionRoundsControl = this.db.currentRoundsControl
    .subscribe(currentRoundsControl => this.processRoundsControl(currentRoundsControl));

  }

  ngOnDestroy() {
    if(this.subscriptionCurrentTeam) {
      this.subscriptionCurrentTeam.unsubscribe();
    }
    if(this.subscriptionRounds) {
      this.subscriptionRounds.unsubscribe();
    }
    if(this.subscriptionRoundsControl) {
      this.subscriptionRoundsControl.unsubscribe();
    }
  }


  // Submitting a form 
  onSubmit(round) {

    this.round = {};
    let answers = [];

    if(this.currentRound != 6) {

      for (const key in round.value) {
        if (Object.prototype.hasOwnProperty.call(round.value, key)) {
          const element = {answer: round.value[key]};
          answers.push(element);
          
        }
      }

    } else {
      // For the triple round, store the answser in an array within a map
      const element = {answer: {ans: [round.value[1], round.value[2], round.value[3]]}};
      answers.push(element);
      const element1 = {answer: {ans: [round.value[4], round.value[5], round.value[6]]}};
      answers.push(element1);
      const element2 = {answer: {ans: [round.value[7], round.value[8], round.value[9]]}};
      answers.push(element2);
      const element3 = {answer: {ans: [round.value[10], round.value[11], round.value[12]]}};
      answers.push(element3);
      const element4 = {answer: {ans: [round.value[13], round.value[14], round.value[15]]}};
      answers.push(element4);
      const element5 = {answer: {ans: [round.value[16], round.value[17], round.value[18]]}};
      answers.push(element5);
      const element6 = {answer: {ans: [round.value[19], round.value[20], round.value[21]]}};
      answers.push(element6);
      const element7 = {answer: {ans: [round.value[22], round.value[23], round.value[24]]}};
      answers.push(element7);
      const element8 = {answer: {ans: [round.value[25], round.value[26], round.value[27]]}};
      answers.push(element8);
      const element9 = {answer: {ans: [round.value[28], round.value[29], round.value[30]]}};
      answers.push(element9);
    }


    this.round.team = this.currentTeam;
    this.round.answers = answers;
    this.round.number = this.currentRound;
    this.hideRounds[this.currentRound-1] = true;

    this.db.setRound(this.round);

  }

  // Current round handling
  setRound(newRound){
    this.currentRound = newRound
  }

  // Sidebar handling
  toggleSidebar(){
    this.statusSidebar = !this.statusSidebar;
  }

  processRounds(rounds) {

    this.rounds = rounds;

    this.setHideRounds();

  }

  processRoundsControl(roundsControl) {

    if(roundsControl.rounds) {
      this.roundsControl = roundsControl.rounds;

      this.setHideRounds();
    }

  }

  setHideRounds() {

    this.hideRounds = [false, false, false, false, false, false, false];

    
    //Loop all rounds and check which rounds the currenTeam has already submitted
    for (let index = 0; index < this.rounds.length; index++) {

      if(this.rounds[index].team == this.currentTeam) {
        this.hideRounds[this.rounds[index].number-1] = true;
      }
      
    }

    //Loop the roundscontrol to check which rounds are open
    for (let index = 0; index < this.roundsControl.length; index++) {

      if(this.roundsControl[index] == false) {
        this.hideRounds[index] = true;
      }
    }

  }
 
  

}


