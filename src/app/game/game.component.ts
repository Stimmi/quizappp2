import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})


export class GameComponent implements OnInit, OnDestroy {

  countries; 
  usedFlags = [[],[],[]];

  flag0: Country;
  flag1: Country;
  flag2: Country;
  flagQuestion: Country;
  
  subscriptionHighscores: Subscription;
  highscores: Highscore[];

  timeLeft: number = 100;
  score: number = 0;
  interval;

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

    this.seed();
    this.flag0 = this.countries[0][0];
    this.flag1 = this.countries[0][1];
    this.flag2 = this.countries[0][2];
    this.flagQuestion = this.countries[0][1];

    this.subscriptionHighscores = this.db.getHighscores()
    .subscribe(hs => {this.highscores = hs});

  }

  ngOnDestroy(): void {
    if(this.subscriptionHighscores){
      this.subscriptionHighscores.unsubscribe();
    }

  }


  async onStart () {

    this.timeLeft = 100;
    this.score = 0;
    this.usedFlags = [[],[],[]];


    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
      }
    },1000)

    await new Promise(resolve => setTimeout(resolve, this.timeLeft*1000));

    alert('Uw score is: ' + this.score);

  }

  onFlagClicked(code: String) {

    if(this.flagQuestion.code == code) {
      this.score++;
    }

    this.setNewFlags();

  }

  setNewFlags() {

    var selectedCategory: number = 0;
    var used: boolean = true;
    let numbers: number[];
    let question: number;


    if(this.timeLeft < 30) {
      selectedCategory = 2;

    } else if (this.timeLeft > 29 && this.timeLeft < 60){
      selectedCategory = 1;

    } else {
      selectedCategory = 0;

    }

    while (used) {

      //Check if all flags of a the category are allready selected. Otherwise clear the list
      if((this.countries[selectedCategory].length) == this.usedFlags[selectedCategory].length) {
        this.usedFlags[selectedCategory] = [];
      };

      //Pick three random number from the selected category, one of them is the anwser/question
      numbers = this.generateThreeRandomNumbers(this.countries[selectedCategory].length);
      question = numbers[Math.floor(Math.random() * numbers.length)];

      //Check if the selected flags is already chosen or not
      if(this.usedFlags[selectedCategory].indexOf(question) === -1) {
        this.usedFlags[selectedCategory].push(question);
        used = false;
      } else {
        used = true;
      }

    }
    
    // Assign the selected flags 
    this.flag0 = this.countries[selectedCategory][numbers[0]];
    this.flag1 = this.countries[selectedCategory][numbers[1]];
    this.flag2 = this.countries[selectedCategory][numbers[2]];

    this.flagQuestion = this.countries[selectedCategory][question];

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

    this.countries = [
    //Easy countries  
    [{name:"België", code:"be"}, 
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
    {name:"Potugal", code:"pt"},
    {name:"Rusland", code:"ru"},
    {name:"Saoudi Arabië", code:"sa"},
    {name:"Zuid-Korea", code:"kr"},
    {name:"Sri Lanka", code:"lk"},
    {name:"Zwitserland", code:"ch"},
    {name:"Turkije", code:"tr"}


    //Medium difficulty countries
    ], [{name: "Bangladesh", code: "bd"},
    {name:"Bhutan", code:"bt"},
    {name:"Bolivië", code:"bo"},
    {name:"Burundi", code:"bi"},
    {name:"Kameroen", code:"cm"}

    //Hard difficulty countries
    ], [{name: "Barbados", code: "bb"},
    {name:"Belize", code:"bz"},
    {name:"Tsjaad", code:"td"},
    {name:"Djibouti", code:"dj"},
    {name:"Eritrea", code:"er"}
    ]

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