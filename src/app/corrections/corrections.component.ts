import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-corrections',
  templateUrl: './corrections.component.html',
  styleUrls: ['./corrections.component.scss']
})
export class CorrectionsComponent implements OnInit, OnDestroy {

  subscriptionCorrections: Subscription;
  subscriptionRounds: Subscription;
  subscriptionTeams: Subscription;
  correctionsList;
  filteredList = [];
  corrections;
  rounds;
  roundsCorrected: number = 0;
  teams = [{ name: "Ploeg" }];

  roundNumbers = ['Ronde', 1, 2, 3, 4, 5, 6, 7];
  checked = ['Verbeterd', 'Ja', 'Nee'];
  usedSubAnswers = [];

  filterForm = new FormGroup({
    roundNumbersControl: new FormControl('Ronde'),
    teamsControl: new FormControl('Ploeg'),
    checkedControl: new FormControl('Verbeterd')

  });

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {

    this.subscriptionCorrections = this.db.getCorrections().subscribe(corrections => this.processCorrections(corrections));
    this.subscriptionRounds = this.db.currentRounds.subscribe(rounds => this.processRounds(rounds));
    this.subscriptionTeams = this.db.currentTeams.subscribe(teams => this.processTeams(teams));

  }


  ngOnDestroy(): void {

    if (this.subscriptionCorrections) {
      this.subscriptionCorrections.unsubscribe();
    }
    if (this.subscriptionRounds) {
      this.subscriptionRounds.unsubscribe();
    }
    if (this.subscriptionTeams) {
      this.subscriptionTeams.unsubscribe();
    }
  }

  processCorrections(corrections) {


    if (corrections) {
      this.corrections = [];

      // Sort the corrections based on the round number
      for (let index = 0; index < corrections.length; index++) {
        this.corrections[corrections[index].number - 1] = corrections[index];
      }

      /*if (this.rounds) {
        this.createCorrectionsList();
      }*/

    }



  }

  processRounds(rounds) {

    if (rounds) {

      this.rounds = rounds;
      
      // Count the number of rounds that are corrected
      this.roundsCorrected = 0;

      for (let index = 0; index < this.rounds.length; index++) {
        if (this.rounds[index].score) {
          this.roundsCorrected++
        }
      }

      /*if (this.corrections) {
        this.createCorrectionsList();
      }*/
    }

  }

  processTeams(teamsDb: any[]) {

    this.teams = [{ name: "Ploeg" }];

    for (let index = 0; index < teamsDb.length; index++) {
      this.teams.push(teamsDb[index])
    }
  }

  addAndExecuteCorrection() {


    // Loop over all rounds
    for (let index = 0; index < this.correctionsList.length; index++) {

      this.correctionsList[index].autoScore = 0;


      // Loop over all answers
      for (let indexx = 0; indexx < this.correctionsList[index].answers.length; indexx++) {

        // If a correction exists, match it with the answer and make auto correction
        if (this.corrections[this.correctionsList[index].number - 1].corrections[indexx]) {

          this.correctionsList[index].answers[indexx].corrections = this.corrections[this.correctionsList[index].number - 1].corrections[indexx].correction;

          // Check if it is not the triple round

          if (this.correctionsList[index].number != 6) {

            let autoCorrectResult = this.autoCorrect(this.correctionsList[index].answers[indexx].answer, this.correctionsList[index].answers[indexx].corrections);

            // Calculate the total of the round an set autoCorrect
            if (autoCorrectResult) {
              this.correctionsList[index].answers[indexx].autoCorrect = true;
              this.correctionsList[index].autoScore++;
            } else {
              this.correctionsList[index].answers[indexx].autoCorrect = false;
            }

            // TRIPLE ROUND LOGIC

          } else if (this.correctionsList[index].number == 6) {

            // Reset all parameters
            this.correctionsList[index].answers[indexx].autoCorrect = [false, false, false];
            this.correctionsList[index].answers[indexx].autoResult = ['', '', ''];
            this.usedSubAnswers = [];

            // Loop the three subanswers
            for (let indexxx = 0; indexxx < 3; indexxx++) {
              let subAnswer = this.correctionsList[index].answers[indexx].answer.ans[indexxx];

              // When a subanswer is empty it will not be corrected
              if (subAnswer.length < 1 || !subAnswer) {
                this.correctionsList[index].answers[indexx].autoResult[indexxx] = 'empty';

              } else {
                // Make a correction of the question
                this.correctionsList[index].answers[indexx].autoResult[indexxx] =
                  this.autoCorrectTriple(subAnswer, this.correctionsList[index].answers[indexx].corrections);

              }

              // When an answer is correct, the autocorrect can be set true!
              if (this.correctionsList[index].answers[indexx].autoResult[indexxx] == 'correct') {
                this.correctionsList[index].answers[indexx].autoCorrect[indexxx] = true;
              }

            }

            // When there is one incorrect answer, everything is wrong! 
            if (this.correctionsList[index].answers[indexx].autoResult.includes('notCorrect')) {
              this.correctionsList[index].answers[indexx].autoCorrect = [false, false, false];
            }

          }


        }

      }

      // For the triple round, the total is calculated for the complete round
      if (this.correctionsList[index].number == 6) {

        this.correctionsList[index].autoScore = this.recalculateTotalTriple(this.correctionsList[index].answers);

      }

      //Loop over all questions of this round

    }

    this.filteredList = this.correctionsList;

    /*// If the filtered list is empty, the complete list can be assigned
    if(!this.filteredList) {
      this.filteredList = this.correctionsList;
    }*/

  }

  autoCorrect(answer: string, corrections: string[]): boolean {

    var autoCorrect = false;

    // Trim all answers and set to lower case
    answer = answer.toString().toLowerCase().trim();

    // Check if the answer matches one of the options in the array
    if (corrections.includes(answer)) {
      autoCorrect = true;
    };

    // check if correction 0 is a part of the answer
    if (answer.includes(corrections[0])) {
      autoCorrect = true;
    };

    return autoCorrect;
  }

  autoCorrectTriple(answer: string, corrections): string {

    var autoCorrect = 'notCorrect';

    // Trim all answers and set to lower case
    answer = answer.toString().toLowerCase().trim();

    // Check if the answer matches one of the three answer arrays for this questions, but only if this answer is not yet answered

    if (!this.usedSubAnswers.includes(0)) {
      // Check if the answer matches one of the options in the array
      if (corrections.m1.includes(answer)) {
        autoCorrect = 'correct';
        // When the answer is correct, this answer array should not be checked anymore
        this.usedSubAnswers.push(0);
      };

      // check if correction 0 is a part of the answer
      if (answer.includes(corrections.m1[0])) {
        autoCorrect = 'correct';
        this.usedSubAnswers.push(0);
      };

    }

    if (!this.usedSubAnswers.includes(1)) {
      if (corrections.m2.includes(answer)) {
        autoCorrect = 'correct';
        this.usedSubAnswers.push(1);
      };

      if (answer.includes(corrections.m2[1])) {
        autoCorrect = 'correct';
        this.usedSubAnswers.push(1);
      };

    }

    if (!this.usedSubAnswers.includes(2)) {
      if (corrections.m3.includes(answer)) {
        autoCorrect = 'correct';
        this.usedSubAnswers.push(2);
      };

      if (answer.includes(corrections.m3[2])) {
        autoCorrect = 'correct';
        this.usedSubAnswers.push(2);
      };

    }

    return autoCorrect;
  }


  onSubmit() {

    this.filterCorrectionsList(this.filterForm.value)

  }

  filterCorrectionsList(formInput) {

    var inbetweenList = [];
    var inbetweenListTwo = [];
    this.filteredList = [];
    this.correctionsList = []

    // Check each parameter and pass on a filtered list
    // Check on the round number
    if (formInput.roundNumbersControl == 'Ronde') {
      inbetweenList = this.rounds
    } else {
      for (let index = 0; index < this.rounds.length; index++) {
        if (this.rounds[index].number == formInput.roundNumbersControl) {
          inbetweenList.push(this.rounds[index]);
        }
      }
    }
    // Check on the selected team
    if (formInput.teamsControl == 'Ploeg') {
      inbetweenListTwo = inbetweenList;
    } else {
      for (let index = 0; index < inbetweenList.length; index++) {
        if (inbetweenList[index].team == formInput.teamsControl) {
          inbetweenListTwo.push(inbetweenList[index])
        }
      }
    }

    // Check on the corrected parameter
    if (formInput.checkedControl == 'Verbeterd') {
      this.correctionsList = inbetweenListTwo;
    } else {
      for (let index = 0; index < inbetweenListTwo.length; index++) {
        if (inbetweenListTwo[index].score && formInput.checkedControl == 'Ja') {
          this.correctionsList.push(inbetweenListTwo[index]);
        }
        if (!inbetweenListTwo[index].score && formInput.checkedControl == 'Nee') {
          this.correctionsList.push(inbetweenListTwo[index]);
        }
      }
    }

    this.addAndExecuteCorrection();

  }

  recalculateTotal(indexFromForm) {

    // When a checkbox is changed, the total of the round must be reculculated
    this.filteredList[indexFromForm].autoScore = 0;

    if(this.filteredList[indexFromForm].number!==6) {

      for (let index = 0; index < this.filteredList[indexFromForm].answers.length; index++) {
        if (this.filteredList[indexFromForm].answers[index].autoCorrect == true) {
          this.filteredList[indexFromForm].autoScore++
        }
      }

    } else if (this.filteredList[indexFromForm].number==6) {
      this.filteredList[indexFromForm].autoScore = this.recalculateTotalTriple(this.filteredList[indexFromForm].answers);
    }



  }

  recalculateTotalTriple(answers): number {

    let roundResult = 0;

    // Loop over all answers
    for (let index = 0; index < answers.length; index++) {
      let result = 0;

      // Loop all subquestions
      for (let indexx = 0; indexx < 3; indexx++) {
        if (answers[index].autoCorrect[indexx] == true) {

          result++;

        };
      }
      // Add the result of the question to the round result
      roundResult = roundResult + result;
    }

    return roundResult;

  }


  setScore(index) {
    let round = this.filteredList[index];

    //Check if the score is a valid number and commit to DB
    if (typeof round.autoScore == 'number') {

      this.filteredList[index].score = round.autoScore;
      this.db.setScore(round.id, round.autoScore);
      this.filterCorrectionsList(this.filterForm.value);

    }


  }


}
