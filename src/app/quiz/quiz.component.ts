import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  // Working with reactive forms check: https://angular.io/guide/reactive-forms

  round;
  team: string = 'Test team'

  round1 = new FormGroup({
    number: new FormControl(1),
    a1: new FormControl(''),
    a2: new FormControl(''),
    a3: new FormControl(''),
    a4: new FormControl(''),
    a5: new FormControl(''),
    a6: new FormControl(''),
    a7: new FormControl(''),
    a8: new FormControl(''),
    a9: new FormControl(''),
    a10: new FormControl('')

  });

  round2 = new FormGroup({
    number: new FormControl(2),
    a1: new FormControl(''),
    a2: new FormControl(''),
    a3: new FormControl(''),
    a4: new FormControl(''),
    a5: new FormControl(''),
    a6: new FormControl(''),
    a7: new FormControl(''),
    a8: new FormControl(''),
    a9: new FormControl(''),
    a10: new FormControl('')

  });

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {
  }


  // Submitting a from 
  onSubmit(round) {

    this.round = round.value;
    this.round.team = this.team;

    this.db.setRound(this.round);


  }

}
