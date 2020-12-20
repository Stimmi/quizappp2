import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  highscores: Observable<any[]>;



  constructor(private afs: AngularFirestore) { 

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

  getRounds() {
    return this.afs.collection("rounds").valueChanges({ idField: 'id' });

  }

  getCorrections () {

    return this.afs.collection('corrections').valueChanges();

  }


/*
  //Data avalaibe in the entire application
  private roundsSource = new BehaviorSubject([]);
  currentRounds = this.roundsSource.asObservable();

  getRounds() {

    this.afs.collection("rounds").valueChanges({ idField: 'id' })
    .subscribe(rounds => this.changeRounds(rounds));

   }

  changeRounds(message: any) {

    this.roundsSource.next(message)
  }
*/

}
