import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { faDesktop, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

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

  registered: boolean = false;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  qrCodeValue: string;

  constructor(private db: DatabaseService,
    private router: Router) { }

  ngOnInit(): void {

    this.registration = {
      name: '',
      email: '',
      team: '',
      amount: 10,
      pak1Amount: 0,
      pak2Amount: 0,
      pak3Amount: 0,
      pak4Amount: 0,
      pak5Amount: 0,
      pak6Amount: 0,
      address: ''
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

    this.registered = true;

    this.qrCodeValue = `BCD\n002\n1\nSCT\nGEBABEBB\nVincent Reynaert\nBE32001416597902\nEUR${this.registration.amount}\n\nInschrijving Superquiz - ploeg ${this.registration.team}`;

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

  recalculateTotal() {

    if(!this.between(this.registration.pak1Amount)) {
      this.registration.pak1Amount = 0;
    }
    if(!this.between(this.registration.pak2Amount)) {
      this.registration.pak2Amount = 0;
    }
    if(!this.between(this.registration.pak3Amount)) {
      this.registration.pak3Amount = 0;
    }
    if(!this.between(this.registration.pak4Amount)) {
      this.registration.pak4Amount = 0;
    }
    if(!this.between(this.registration.pak5Amount)) {
      this.registration.pak5Amount = 0;
    }
    if(!this.between(this.registration.pak6Amount)) {
      this.registration.pak5Amount = 0;
    }

    this.registration.amount = 10;
    this.registration.amount += (this.registration.pak1Amount * 15); 
    this.registration.amount += (this.registration.pak2Amount * 15); 
    this.registration.amount += (this.registration.pak3Amount * 20); 
    this.registration.amount += (this.registration.pak4Amount * 10); 
    this.registration.amount += (this.registration.pak5Amount * 10); 
    this.registration.amount += (this.registration.pak6Amount * 7); 

  }

  between(pakAmount) {
    if(pakAmount >= 0 && pakAmount < 100) {
      return true;
    } else {
      return false;
    }
  }

  backToHomePage() {
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['registreer']);
  });   }

}


interface Registration {
  name: string;
  email: string;
  team: string;
  amount: number;
  pak1Amount: number;
  pak2Amount: number;
  pak3Amount: number;
  pak4Amount: number;
  pak5Amount: number;
  pak6Amount: number;
  address: string;

}