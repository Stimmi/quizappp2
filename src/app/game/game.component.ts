import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})


export class GameComponent implements OnInit {

  easyCountries: Country[];
  flag0: Country;
  flag1: Country;
  flag2: Country;
  flagQuestion: Country;


  constructor() { }

  ngOnInit(): void {

    this.seed();
    this.flag0 = this.easyCountries[0];
    this.flag1 = this.easyCountries[1];
    this.flag2 = this.easyCountries[3];
    this.flagQuestion = this.easyCountries[0];

  }

  onStart() {

    let numbers = this.generateThreeRandomNumber(this.easyCountries.length);

    this.flag0 = this.easyCountries[numbers[0]];
    this.flag1 = this.easyCountries[numbers[1]];
    this.flag2 = this.easyCountries[numbers[2]];

    this.flagQuestion = this.easyCountries[numbers[Math.floor(Math.random() * numbers.length)]];

  }

  generateThreeRandomNumber (base:number) {

    let numbers: number[] = [];

    while(numbers.length < 3){
      var r = Math.floor(Math.random() * base);
      if(numbers.indexOf(r) === -1) numbers.push(r);
    }

    return numbers;
  }

  seed() {

    this.easyCountries = [{name:"Belgie", code:"be"}, 
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
