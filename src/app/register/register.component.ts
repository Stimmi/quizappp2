import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registration : Registration;
  formules: string[] = ['Online (€5)','Pretpakket (€15)'];

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

    this.registration = {
      name: '',
      email: '',
      formule:this.formules[0]
    }
  }

  onSubmit() {

    this.db.setRegistration(this.registration);

  }

}


interface Registration {
  name: string;
  email: string;
  formule: string;

}