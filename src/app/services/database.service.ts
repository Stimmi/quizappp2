import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  highscores: Observable<any[]>;

  private roundsSource = new BehaviorSubject([]);
  currentRounds = this.roundsSource.asObservable();

  constructor(private afs: AngularFirestore) { 

    //Upon loading the app all rounds are loaded
    this.getRounds();
  }

  getHighscores () {
    this.highscores = this.afs.collection('highscores').valueChanges();
    return this.highscores;

  }

  setHighscore(highscore) {
    return this.afs.collection(`highscores`).add(Object.assign({},highscore));
  }

  setRound(round) {
    return this.afs.collection(`rounds`).add(Object.assign({},round));
  }

  getCorrections () {

    return this.afs.collection('corrections').valueChanges();

  }



  //Data avalaibe in the entire application
  getRounds() {

    this.afs.collection("rounds").valueChanges({ idField: 'id' })
    .subscribe(rounds => this.changeRounds(rounds));

   }

  changeRounds(message: any) {

    this.roundsSource.next(message)
  }


}
