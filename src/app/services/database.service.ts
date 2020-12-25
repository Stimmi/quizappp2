import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  highscores: Observable<any[]>;

  private teamsSource = new BehaviorSubject([]);;
  currentTeams = this.teamsSource.asObservable();


  constructor(private afs: AngularFirestore) { 

    this.getTeams();

  }

  getHighscores () {
    this.highscores = this.afs.collection('highscores').valueChanges();
    return this.highscores;

  }

  setHighscore(highscore) {
    return this.afs.collection("highscores").add(Object.assign({},highscore));
  }

  setRound(round) {
    return this.afs.collection("rounds").add(Object.assign({},round));
  }

  getRounds() {
    return this.afs.collection("rounds").valueChanges({ idField: 'id' });

  }

  getCorrections () {

    return this.afs.collection('corrections').valueChanges();

  }

  getTeams() {
    
    this.afs.collection("teams").valueChanges({ idField: 'id' })
    .subscribe(teams => this.changeTeams(teams));
  }

  changeTeams(message: any) {

    this.teamsSource.next(message)
  }

  setScore(docId, score) {
    this.afs.collection("rounds").doc(docId).update({
      score: score
    });
  }

  setRegistration(registration) {
    return this.afs.collection("registrations").add(Object.assign({},registration));

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
