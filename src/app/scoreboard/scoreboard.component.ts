import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';


@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {

  subscriptionRounds: Subscription;
  rounds;
  totalScoreList;



  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

    this.subscriptionRounds = this.db.currentRounds.subscribe(rounds => this.processRounds(rounds));

  }

  processRounds(rounds) {

    this.rounds = rounds;
    this.createTotalScoreList();

  }

  createTotalScoreList() {

    this.totalScoreList = [];

    for (let index = 0; index < this.rounds.length; index++) {

      if(!this.totalScoreList.some(el => el.team == this.rounds[index].team)) {

        let entry = {
          team: this.rounds[index].team,
          score: 0
        }
      
      this.totalScoreList.push(entry)
    }
  }

    for (let index = 0; index < this.rounds.length; index++) {

      for (let indexx = 0; indexx < this.totalScoreList.length; indexx++) {
        if(this.rounds[index].team == this.totalScoreList[indexx].team && this.rounds[index].score) {
          this.totalScoreList[indexx].score = this.rounds[index].score + this.totalScoreList[indexx].score;
        }
        
      }

  }

  this.totalScoreList.sort((a,b) => b.score - a.score);

}



}
