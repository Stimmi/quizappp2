import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';


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

  // Booleans to hide the submit button when a round is finished or already submitted
  // [0] = round 1 
  // [1] = round 2 
  // [2] = round 3
  // ...
  hideRounds: boolean[] = [false, false, false, false, false, false]

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
    10: new FormControl('')

  });

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

    this.subscriptionCurrentTeam = this.db.currentTeam
    .subscribe(currentTeam => {this.currentTeam = currentTeam});

    this.subscriptionRounds = this.db.currentRounds
    .subscribe(currentRounds => this.processRounds(currentRounds));

  }

  ngOnDestroy() {
    if(this.subscriptionCurrentTeam) {
      this.subscriptionCurrentTeam.unsubscribe();
    }
    if(this.subscriptionRounds) {
      this.subscriptionRounds.unsubscribe();
    }
  }


  // Submitting a form 
  onSubmit(round) {

    this.round = {};
    let answers = [];

    for (const key in round.value) {
      if (Object.prototype.hasOwnProperty.call(round.value, key)) {
        const element = {answer: round.value[key]};
        answers.push(element);
        
      }
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
    console.log(this.statusSidebar)       
  }

  processRounds(rounds) {

    this.rounds = rounds;

    //Loop all rounds and check which rounds the currenTeam has already submitted
    for (let index = 0; index < rounds.length; index++) {

      if(this.rounds[index].team == this.currentTeam) {
        this.hideRounds[this.rounds[index].number-1] = true;
      }
      
    }

  }

 
    
  

}


