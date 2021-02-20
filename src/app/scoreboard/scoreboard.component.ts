import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup } from '@angular/forms';


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
  allRounds;
  rounds;
  totalScoreList;
  roundScoreList;
  teamScoreList;

  currentTeam;
  teams;

  roundNumbers = [1,2,3,4,5,6,7];

  filterRoundForm = new FormGroup({
    roundNumbersControl: new FormControl(1),

  });

  filterTeamForm = new FormGroup({
    teamControl: new FormControl()

  });

  classGen: string = 'nav-item nav-link active'
  classRound: string = 'nav-item nav-link'
  classTeam: string = 'nav-item nav-link'

  classActive = 'nav-item nav-link active'
  classInactive = 'nav-item nav-link'

  general: boolean = true;
  round: boolean = false;
  team: boolean = false;


  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

      this.subscriptionRounds = this.db.currentRounds.subscribe(rounds => this.processRounds(rounds));
      this.subscriptionCurrentTeam = this.db.currentTeam.subscribe(currentTeam => 
        {this.currentTeam = currentTeam; this.filterTeamForm.controls['teamControl'].setValue(this.currentTeam);this.filterTeam()
      });
      
  }

  processRounds(rounds) {


    this.allRounds = rounds;
    this.rounds = this.filterNotCorrectedRounds(this.allRounds);
    this.createTeamsList();
    this.createTotalScoreList();
    this.createRoundScoreList(this.filterRoundForm.value.roundNumbersControl);
    this.filterTeam();


  }

  createTeamsList() {
    this.teams = [];

    for (let index = 0; index < this.rounds.length; index++) {

      if(!this.teams.some(el => el == this.rounds[index].team)) {

        this.teams.push(this.rounds[index].team)
      }
    }

  }

  createTotalScoreList() {

    // Create an element for every team that has a submitted and corrected round
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

    // Loop all rounds and calculate the total score 

    for (let index = 0; index < this.rounds.length; index++) {

      for (let indexx = 0; indexx < this.totalScoreList.length; indexx++) {
        if(this.rounds[index].team == this.totalScoreList[indexx].team && this.rounds[index].score) {
          this.totalScoreList[indexx].score = this.rounds[index].score + this.totalScoreList[indexx].score;
        }
      }
    }

  this.totalScoreList.sort((a,b) => b.score - a.score);

}

  createRoundScoreList(roundNumber) {

    this.roundScoreList = [];

    for (let index = 0; index < this.rounds.length; index++) {

      if(!this.roundScoreList.some(el => el.team == this.rounds[index].team)) {

        let entry = {
          team: this.rounds[index].team,
          score: 0
        }
      
        this.roundScoreList.push(entry)
      }
  }


  for (let index = 0; index < this.rounds.length; index++) {

    for (let indexx = 0; indexx < this.roundScoreList.length; indexx++) {
      if(this.rounds[index].team == this.roundScoreList[indexx].team && this.rounds[index].score && this.rounds[index].number == roundNumber) {
        this.roundScoreList[indexx].score = this.rounds[index].score + this.roundScoreList[indexx].score;
      }
    }
  }

  this.roundScoreList.sort((a,b) => b.score - a.score);

  }

  createTeamScoreList(team) {

    this.teamScoreList = [];

    for (let index = 0; index < this.rounds.length; index++) {

      if(this.rounds[index].team == team && this.rounds[index].score) {
        this.teamScoreList.push(this.rounds[index]);
      }
    }

    this.teamScoreList.sort((a,b) => a.number - b.number);

  }

  filterRound() {

    this.createRoundScoreList(this.filterRoundForm.value.roundNumbersControl);

  }

  filterTeam() {

    this.createTeamScoreList(this.filterTeamForm.value.teamControl);
  }

  filterNotCorrectedRounds(rounds) {

    let result = []

    for (let index = 0; index < rounds.length; index++) {
      if(rounds[index].score) {
        result.push(rounds[index]);
      }
    }

    return result;

  }

  changeTable(table) {

    this.general = false;
    this.classGen = this.classInactive;
    
    this.round = false;
    this.classRound = this.classInactive;

    this.team = false;
    this.classTeam = this.classInactive;

    switch (table) {
      case 'general':
        this.general = true;
        this.classGen = this.classActive;
        break;
      
      case 'round':    
        this.round = true;
        this.classRound = this.classActive;
        break;

      case 'team':
        this.team = true;
        this.classTeam = this.classActive;
        break;

      default:
        this.general = true;
        this.classGen = this.classActive;
        break;
    }
  }



}
