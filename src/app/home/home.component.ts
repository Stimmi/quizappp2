import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { faFontAwesomeFlag } from '@fortawesome/free-brands-svg-icons';
import { faFlagUsa, faFlagCheckered } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {


  // FA icons
  faPlayCircle = faPlayCircle;
  faFlag = faFontAwesomeFlag;
  faFlagcheck = faFlagCheckered
  faFlagusa = faFlagUsa
  currentTeam;
  subscriptionCurrentTeam: Subscription;

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

    this.subscriptionCurrentTeam = this.db.currentTeam.subscribe(currentTeam => {this.currentTeam = currentTeam});

  }

  ngOnDestroy(): void {
    if(this.subscriptionCurrentTeam) {
      this.subscriptionCurrentTeam.unsubscribe();
    }
  }

}
