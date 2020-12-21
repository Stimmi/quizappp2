import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

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
  team: string = 'Test team'

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
  }


  // Submitting a from 
  onSubmit(round, number) {

    this.round = {};
    let answers = [];

    for (const key in round.value) {
      if (Object.prototype.hasOwnProperty.call(round.value, key)) {
        const element = {answer: round.value[key], number: key};
        answers.push(element);
        
      }
    }

    this.round.team = this.team;
    this.round.answers = answers;
    this.round.number = number;

    this.db.setRound(this.round);


  }

 
    
  

}


