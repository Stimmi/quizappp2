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
toggleSidebar(){
    this.statusSidebar = !this.statusSidebar;
    console.log(this.statusSidebar)       
}

// Current Round handling
currentRound = 1
setRound(newRound){
  this.currentRound = newRound
}

  // Working with reactive forms check: https://angular.io/guide/reactive-forms

  round;
  currentTeam;
  subscriptionCurrentTeam: Subscription;

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

  }

  ngOnDestroy() {
    if(this.subscriptionCurrentTeam) {
      this.subscriptionCurrentTeam.unsubscribe();
    }
  }



  // Submitting a form 
  onSubmit(round, number) {

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
    this.round.number = number;

    this.db.setRound(this.round);


  }

 
    
  

}


