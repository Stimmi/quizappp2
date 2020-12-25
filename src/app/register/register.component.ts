import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registration : Registration;
  formules: string[] = ['Online (€5)','Pretpakket (€15)'];
  subscriptionTeams: Subscription;
  teams;
  wrongCode: boolean = false;

  code:string;

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

  validate(){
    var form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
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