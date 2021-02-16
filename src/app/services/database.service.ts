import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  highscores: Observable<any[]>;

  private teamsSource = new BehaviorSubject([]);
  currentTeams = this.teamsSource.asObservable();

  private currentTeamSource = new BehaviorSubject<string>('');
  currentTeam = this.currentTeamSource.asObservable();

  private adminUsersSource = new BehaviorSubject([]);
  currentAdminUsers = this.adminUsersSource.asObservable();

  private roundsSource = new BehaviorSubject([]);
  currentRounds = this.roundsSource.asObservable();

  private roundsControlSource = new BehaviorSubject([]);
  currentRoundsControl = this.roundsControlSource.asObservable();


  constructor(private afs: AngularFirestore) { 

    this.getTeams();
    this.getRounds();
    this.getRoundsControl();


    this.changeCurrentTeam(localStorage.currentTeam);

    this.changeCurrentAdminUsers(['superquiz crew']);


  }

  getHighscores () {
    this.highscores = this.afs.collection('highscores').valueChanges({ idField: 'id' });
    return this.highscores;

  }

  setHighscore(highscore) {
    return this.afs.collection("highscores").add(Object.assign({},highscore));
  }

  updateHighscore(id, highscore) {
    return this.afs.collection("highscores").doc(id).set(Object.assign({},highscore));
  }

  setRound(round) {
    return this.afs.collection("rounds").add(Object.assign({},round));
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

  getRegistrations() {
    return this.afs.collection('registrations').valueChanges({ idField: 'id' });

   }


  changeCurrentTeam(message: string) {

    this.currentTeamSource.next(message)
  }

  changeCurrentAdminUsers(message: any) {

    this.adminUsersSource.next(message)
  }

  getRounds() {

    this.afs.collection("rounds").valueChanges({ idField: 'id' })
    .subscribe(rounds => this.changeRounds(rounds));

   }

  changeRounds(message: any) {

    this.roundsSource.next(message)
  }

  getRoundsControl() {

    this.afs.doc("controls/tPm2Co9wqIioaR2OMzC8").valueChanges({ idField: 'id' })
    .subscribe(roundsControl => this.changeRoundsControl(roundsControl));

   }

   setRoundsControl(roundsControl) {

    this.afs.doc("controls/tPm2Co9wqIioaR2OMzC8").update({rounds: roundsControl })

   }

  changeRoundsControl(message: any) {

    this.roundsControlSource.next(message)
  }



}
