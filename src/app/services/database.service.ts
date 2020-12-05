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
}
