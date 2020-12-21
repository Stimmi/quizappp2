import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],

  animations: [
    trigger('flyInOut', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('1000ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ])
  ]

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

  classFlag0 = 'selection';
  classFlag1 = 'selection';
  classFlag2 = 'selection';
  classFlagStart = 'selection';

  gameState: string = 'start';
  playerName: string = '';
  save: boolean = true;
  showCountry = true;
  flagClicked = false;




  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

    this.seed();
    this.flag0 = this.countries[0][0];
    this.flag1 = this.countries[0][1];
    this.flag2 = this.countries[0][2];
    this.flagQuestion = this.countries[0][1];

    this.subscriptionHighscores = this.db.getHighscores()
    .subscribe(hs => this.processHighscores(hs));

  }

  ngOnDestroy(): void {
    if(this.subscriptionHighscores){
      this.subscriptionHighscores.unsubscribe();
    }

  }


  async onStart () {

    this.gameState = 'game';
    this.save = true;
    this.timeLeft = 100;
    this.score = 0;
    this.usedFlags = [[],[],[]];

    await new Promise(resolve => {
      const interval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          resolve('');
          clearInterval(interval);
        };
      }, 1000);})

      this.gameState = 'finish';


  }


  async onFlagClicked(code: String) {

    if(!this.flagClicked) {

    this.flagClicked = true;

    // Add point to score when answer is correct
    if(this.flagQuestion.code == code) {
      this.score++;
    }

    //Make the correct flag bigger
    if(this.flagQuestion.code == this.flag0.code) {
      this.classFlag0 = 'correct';
    } else {
      this.classFlag0 = 'incorrect';
    }
    if(this.flagQuestion.code == this.flag1.code) {
      this.classFlag1 = 'correct';
    } else {
      this.classFlag1 = 'incorrect';
    }
    if(this.flagQuestion.code == this.flag2.code) {
      this.classFlag2 = 'correct';
    } else {
      this.classFlag2 = 'incorrect';
    }

    this.showCountry = false;

    await new Promise(resolve => setTimeout(resolve, 1000))
    this.setNewFlags();

    }


  }

  setNewFlags() {

    var selectedCategory: number = 0;
    var used: boolean = true;
    let numbers: number[];
    let question: number;

    this.classFlag0 = this.classFlagStart;
    this.classFlag1 = this.classFlagStart;
    this.classFlag2 = this.classFlagStart;

    this.showCountry = true;
    this.flagClicked = false;


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

  saveHighScore(): boolean {

    this.save = false;

    let highscore = {
      team: this.playerName, 
      score: this.score
    }

    if(this.playerName.length > 1) {
      this.db.setHighscore(highscore)

    }

    return false;

  }

  processHighscores(hs) {

    this.highscores = hs;
    this.highscores.sort((a,b) => b.score - a.score);
  }

  seed(): void {

    this.countries = [
    //Easy countries  
    [{name:"België", code:"be"}, 
    {name:"Nederland", code:"nl"},
    {name:"Bulgarije", code:"bg"},
    {name:"Frankrijk", code:"fr"},
    {name:"Duitsland", code:"de"},
    {name:"China", code:"cn"},
    {name:"Antartica", code:"aq"},
    {name:"Cambodia", code:"kh"},
    {name:"Colombia", code:"co"},
    {name:"Ethiopië", code:"et"},
    {name:"Fiji", code:"fj"},
    {name:"Georgië", code:"ge"},
    {name:"Groenland", code:"gl"},

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
    {name:"Portugal", code:"pt"},
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
    {name:"Brunei", code:"bn"},
    {name:"Costa Rica", code:"cr"},
    {name:"Curaçao", code:"cw"},
    {name:"Dominicaanse Rebubliek", code:"do"},
    {name:"Haiti", code:"ht"},
    {name:"Hong Kong", code:"hk"},
    {name:"Hongarije", code:"hu"},
    {name:"Ijsland", code:"is"},
    {name:"Maleisië", code:"my"},
    {name:"Micornesië", code:"fm"},
    {name:"Mongolië", code:"mn"},
    {name:"Myanmar", code:"mm"},

    {name:"Kameroen", code:"cm"},
    {name:"Andorra", code:"ad"},
    {name:"Angola", code:"ao"},
    {name:"Chili", code:"cl"},
    {name:"Venezuela", code:"ve"},
    {name:"Uruguay", code:"uy"},
    {name:"Tunesië", code:"tn"},
    {name:"Thailand", code:"th"},

    {name:"Oostenrijk", code:"at"},
    {name:"Armenië", code:"am"},
    {name:"Azerbeidzjan", code:"az"},
    {name:"Wit-Rusland", code:"by"},
    {name:"Bosnië-Herzegovina", code:"ba"}


    //Hard difficulty countries
    ], [{name: "Barbados", code: "bb"},
    {name:"Belize", code:"bz"},
    {name:"Tsjaad", code:"td"},
    {name:"Djibouti", code:"dj"},
    {name:"Eritrea", code:"er"},
    {name:"Benin", code:"bj"},
    {name:"Botswana", code:"bw"},
    {name:"Gabon", code:"ga"},
    {name:"Mali", code:"ml"},

    {name:"Burkina Faso", code:"bf"},
    {name:"Tuvalu", code:"tv"},
    {name:"Oost-Timor", code:"tl"},
    {name:"Guinee Bissau", code:"gw"},
    {name:"Guyana", code:"gy"},
    {name:"Irak", code:"iq"},
    {name:"Syrie", code:"sy"},
    {name:"Palestina", code:"ps"},
    {name:"Turkmenistan", code:"tm"},

    {name:"Egypte", code:"eg"},
    {name:"Kyrgyzië", code:"kg"},
    {name:"Mauritanië", code:"mr"},
    {name:"Mauritius", code:"mu"},
    {name:"Nauru", code:"nr"},
    {name:"Yemen", code:"ye"},

    {name:"Zambia", code:"zm"},
    {name:"Zimbabwe", code:"zw"},

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