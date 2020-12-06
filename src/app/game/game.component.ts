import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})


export class GameComponent implements OnInit, OnDestroy {

  easyCountries: Country[];
  flag0: Country;
  flag1: Country;
  flag2: Country;
  flagQuestion: Country;
  
  subscriptionHighscores: Subscription;
  highscores: Highscore[];

  timeLeft: number = 10;
  score: number = 0;
  interval;

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

    this.seed();
    this.flag0 = this.easyCountries[0];
    this.flag1 = this.easyCountries[1];
    this.flag2 = this.easyCountries[3];
    this.flagQuestion = this.easyCountries[0];

    this.subscriptionHighscores = this.db.getHighscores()
    .subscribe(hs => {this.highscores = hs});

  }

  ngOnDestroy(): void {
    if(this.subscriptionHighscores){
      this.subscriptionHighscores.unsubscribe();
    }

  }


  async onStart () {

    this.timeLeft = 10;
    this.score = 0;

    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
      }
    },1000)

    await new Promise(resolve => setTimeout(resolve, this.timeLeft*1000));

  }

  onFlagClicked(code: String) {

    if(this.flagQuestion.code == code) {
      this.score++;
    }

    this.setNewFlags();


  }

  setNewFlags() {
    
    let numbers = this.generateThreeRandomNumbers(this.easyCountries.length);

    this.flag0 = this.easyCountries[numbers[0]];
    this.flag1 = this.easyCountries[numbers[1]];
    this.flag2 = this.easyCountries[numbers[2]];

    this.flagQuestion = this.easyCountries[numbers[Math.floor(Math.random() * numbers.length)]];

  }



  generateThreeRandomNumbers (base:number): number[] {

    let numbers: number[] = [];

    while(numbers.length < 3){
      var r = Math.floor(Math.random() * base);
      if(numbers.indexOf(r) === -1) numbers.push(r);
    }

    return numbers;
  }

  seed(): void {

    this.easyCountries = [{name:"België", code:"be"}, 
    {name:"Nederland", code:"nl"},
    {name:"Frankrijk", code:"fr"},
    {name:"Duitsland", code:"de"},
    {name:"China", code:"cn"},
    {name:"Antartica", code:"aq"},
    {name:"Cambodia", code:"kh"},
    {name:"Canada", code:"ca"},
    {name:"Congo DRC", code:"cd"},
    {name:"Cuba", code:"cu"},
    {name:"Cyprus", code:"cy"},
    {name:"Tsjechië", code:"cz"},
    {name:"Denemarken", code:"dk"},
    {name:"Griekenland", code:"gr"},
    {name:"Het Vaticaan", code:"va"},
    {name:"India", code:"in"},
    {name:"Israël", code:"il"},
    {name:"Mexico", code:"mx"},
    {name:"Libanon", code:"lb"},
    {name:"Kenia", code:"ke"},
    {name:"Laos", code:"la"},
    {name:"Nepal", code:"np"},
    {name:"Marokko", code:"ma"},
    {name:"Noorwegen", code:"no"},
    {name:"Marokko", code:"ma"},
    {name:"Potugal", code:"pt"},
    {name:"Rusland", code:"ru"},
    {name:"Saoudi Arabië", code:"sa"},
    {name:"Zuid-Korea", code:"kr"},
    {name:"Sri Lanka", code:"lk"},
    {name:"Zwitserland", code:"ch"},
    {name:"Turkije", code:"tr"},


  ];

  }


}


interface Country {

  name: String;
  code: String;

}

 interface Highscore {
  team: string;
  score: number;
}