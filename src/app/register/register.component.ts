import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { faDesktop, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registration : Registration;
  formules: string[] = ['Pretpakket', 'Online (zelf de tussenronde afdrukken) - €10'];
  subscriptionTeams: Subscription;
  teams;
  wrongCode: boolean = false;

  code:string;

    // Font awesome icons
    faYoutube = faYoutube;
    faDesktop = faDesktop;
    faPlus = faPlus;

  constructor(private db: DatabaseService,
    private router: Router) { }

  ngOnInit(): void {

    this.registration = {
      name: '',
      email: '',
      formule:this.formules[0],
      team: ''
    }

    this.subscriptionTeams = this.db.currentTeams.subscribe(teams => this.processTeams(teams));
  }

  ngOnDestroy(): void {
    if(this.subscriptionTeams) {
      this.subscriptionTeams.unsubscribe();
    }
  }
 
  onSubmit() {
    this.db.setRegistration(this.registration);
  }


  onSubmitCode() {

    for (let index = 0; index < this.teams.length; index++) {

      if(this.code == this.teams[index].code) {

        this.db.changeCurrentTeam(this.teams[index].name);

        this.router.navigate(['start']);

        localStorage.setItem("currentTeam", this.teams[index].name);
        
        this.wrongCode = false;
      

      } else {
        this.wrongCode = true;

      }


      
    }

  }

  wrongCodeFalse(){
    this.wrongCode = false;
  }

  processTeams(teams) {

    this.teams = teams;
    
  }

}


interface Registration {
  name: string;
  email: string;
  formule: string;
  team: string;

}