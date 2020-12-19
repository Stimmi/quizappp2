import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  highscores: Observable<any[]>;

  constructor(private afs: AngularFirestore) { }

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
}
