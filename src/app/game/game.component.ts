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


  onStart (): void {

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
    {name:"China", code:"cn"}

  ];

  }


}


class Country {

  name: String;
  code: String;

  constructor(name: String, code: String) {
    this.name = name;
    this.code = code;
  }
}

 interface Highscore {
  team: string;
  score: number;
}