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
        animate('700ms ease-in', style({transform: 'translateX(100%)'}))
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
  // Set the amount of time that each game will take
  gameTime: number = 100;
  score: number = 0;
  interval;
  streakCounter: number = 0;

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
    this.timeLeft = this.gameTime;
    this.setNewFlags();
    this.score = 0;
    this.usedFlags = [[],[],[]];
    this.streakCounter = 0;


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

    // Prevent the player from clicking the same flag twice
    if(!this.flagClicked) {

    this.flagClicked = true;

    // Add point to score when answer is correct
    if(this.flagQuestion.code == code) {
      this.score++;
      this.streakCounter++
    } else {
      this.streakCounter = 0;
    }

    // When the streak counter reach max value, bonus time is granted
    if(this.streakCounter == 7) {
      this.timeLeft = this.timeLeft + 3;
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

    await new Promise(resolve => setTimeout(resolve, 700))
    this.setNewFlags();

      if(this.streakCounter == 7) {
        this.streakCounter = 0;
      }

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
    {name:"Albanië", code:"al"},
    {name:"Argentinië", code:"ar"},
    {name:"Australië", code:"au"},
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
    {name:"Kroatië", code:"hr"},
    {name:"Canada", code:"ca"},
    {name:"Congo DRC", code:"cd"},
    {name:"Cuba", code:"cu"},
    {name:"Cyprus", code:"cy"},
    {name:"Tsjechië", code:"cz"},
    {name:"Denemarken", code:"dk"},
    {name:"Finland", code:"fi"},
    {name:"Griekenland", code:"gr"},
    {name:"Het Vaticaan", code:"va"},
    {name:"India", code:"in"},
    {name:"Ierland", code:"ie"},
    {name:"Jamaica", code:"jm"},
    {name:"Israël", code:"il"},
    {name:"Italië", code:"it"},
    {name:"Malta", code:"mt"},
    {name:"Mexico", code:"mx"},
    {name:"Libanon", code:"lb"},
    {name:"Kenia", code:"ke"},
    {name:"Laos", code:"la"},
    {name:"Nepal", code:"np"},
    {name:"Marokko", code:"ma"},
    {name:"Noorwegen", code:"no"},
    {name:"Portugal", code:"pt"},
    {name:"Rusland", code:"ru"},
    {name:"Slovenië", code:"si"},
    {name:"Saoudi Arabië", code:"sa"},
    {name:"Spanje", code:"es"},
    {name:"Taiwan", code:"tw"},
    {name:"Singapore", code:"sg"},
    {name:"Vietnam", code:"vn"},
    {name:"Verenigde Staten", code:"us"},
    {name:"Zuid-Korea", code:"kr"},
    {name:"Sri Lanka", code:"lk"},
    {name:"Suriname", code:"sr"},
    {name:"Zwitserland", code:"ch"},
    {name:"Zweden", code:"se"},
    {name:"Turkije", code:"tr"}


    //Medium difficulty countries
    ], [{name: "Bangladesh", code: "bd"},
    {name:"Bhutan", code:"bt"},
    {name:"Algarije", code:"dz"},
    {name:"Bolivië", code:"bo"},
    {name:"Burundi", code:"bi"},
    {name:"Brunei", code:"bn"},
    {name:"Bahrein", code:"bh"},
    {name:"Costa Rica", code:"cr"},
    {name:"Curaçao", code:"cw"},
    {name:"Centraal Afrikaanse Republiek", code:"cf"},
    {name:"Dominicaanse Rebubliek", code:"do"},
    {name:"Filipijnen", code:"ph"},
    {name:"Ecuador", code:"ec"},
    {name:"Ghana", code:"gh"},
    {name:"Haiti", code:"ht"},
    {name:"Hong Kong", code:"hk"},
    {name:"Hongarije", code:"hu"},
    {name:"Ijsland", code:"is"},
    {name:"Indonesië", code:"id"},
    {name:"Iran", code:"ir"},
    {name:"Kazachstan", code:"kz"},
    {name:"Letland", code:"lv"},
    {name:"Liberia", code:"lr"},
    {name:"Litouwen", code:"lt"},
    {name:"Lichtenstein", code:"li"},
    {name:"Maleisië", code:"my"},
    {name:"Madagascar", code:"mg"},
    {name:"Micornesië", code:"fm"},
    {name:"Mongolië", code:"mn"},
    {name:"Moldavië", code:"md"},
    {name:"Montenegro", code:"me"},
    {name:"Myanmar", code:"mm"},
    {name:"Noord-Korea", code:"kp"},
    {name:"Niger", code:"ne"},
    {name:"Nigeria", code:"ng"},
    {name:"Oman", code:"om"},
    {name:"Oezbekistan", code:"uz"},
    {name:"Pakistan", code:"pk"},
    {name:"Panama", code:"pa"},
    {name:"Papoea-Nieuw-Guinea", code:"pg"},
    {name:"Somalië", code:"so"},
    {name:"Senegal", code:"sn"},
    {name:"Servië", code:"rs"},
    {name:"San Marino", code:"sm"},
    {name:"Kameroen", code:"cm"},
    {name:"Andorra", code:"ad"},
    {name:"Angola", code:"ao"},
    {name:"Chili", code:"cl"},
    {name:"Venezuela", code:"ve"},
    {name:"Uruguay", code:"uy"},
    {name:"Oeganda", code:"ug"},
    {name:"Rwanda", code:"rw"},
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
    {name:"Bahamas", code:"bs"},
    {name:"Comoren", code:"km"},
    {name:"Djibouti", code:"dj"},
    {name:"Eritrea", code:"er"},
    {name:"Equatoriaal-Guinea", code:"gq"},
    {name:"El-Salvador", code:"sv"},
    {name:"Benin", code:"bj"},
    {name:"Botswana", code:"bw"},
    {name:"Gabon", code:"ga"},
    {name:"Gambia", code:"gm"},
    {name:"Guatemala", code:"gt"},
    {name:"Ivoorkust", code:"ci"},
    {name:"Jordanië", code:"jo"},
    {name:"Kiribati", code:"ki"},
    {name:"Lesotho", code:"ls"},
    {name:"Libië", code:"ly"},
    {name:"Mali", code:"ml"},
    {name:"Malawi", code:"mw"},
    {name:"Maladiven", code:"mv"},
    {name:"Marshall Eilanden", code:"mh"},
    {name:"Mozambique", code:"mz"},
    {name:"Namibië", code:"na"},
    {name:"Nicaragua", code:"ni"},
    {name:"Burkina Faso", code:"bf"},
    {name:"Tuvalu", code:"tv"},
    {name:"Oost-Timor", code:"tl"},
    {name:"Palau", code:"pw"},
    {name:"Guinee Bissau", code:"gw"},
    {name:"Guyana", code:"gy"},
    {name:"Irak", code:"iq"},
    {name:"Syrie", code:"sy"},
    {name:"Swaziland", code:"sz"},
    {name:"Verenigde Arabische Emiraten", code:"ae"},
    {name:"Palestina", code:"ps"},
    {name:"Soedan", code:"sd"},
    {name:"Solomon Eilanden", code:"sb"},
    {name:"Seychellen", code:"sc"},
    {name:"Turkmenistan", code:"tm"},
    {name:"Trinidad en Tobaga", code:"tt"},
    {name:"Togo", code:"tg"},
    {name:"Tonga", code:"to"},
    {name:"Tadzjikistan", code:"tj"},
    {name:"Egypte", code:"eg"},
    {name:"Kyrgyzië", code:"kg"},
    {name:"Mauritanië", code:"mr"},
    {name:"Mauritius", code:"mu"},
    {name:"Nauru", code:"nr"},
    {name:"Yemen", code:"ye"},
    {name:"Zambia", code:"zm"},
    {name:"Zimbabwe", code:"zw"}

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