import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import { getLocaleExtraDayPeriodRules } from '@angular/common';


@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {

  // Font awesome icons
  faUsers = faUsers;
  faMedal = faMedal;

  subscriptionRounds: Subscription;
  subscriptionCurrentTeam: Subscription;
  rounds;
  totalScoreList;
  currentTeam;

  
  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

      this.subscriptionRounds = this.db.currentRounds.subscribe(rounds => this.processRounds(rounds));
      this.subscriptionCurrentTeam = this.db.currentTeam.subscribe(currentTeam => {this.currentTeam = currentTeam});
      
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
