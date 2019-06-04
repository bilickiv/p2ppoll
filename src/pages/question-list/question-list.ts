import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuestionPage } from '../question/question';
import * as firebase from 'firebase';
import { convertArray } from '../../app/envrionment';

/**
 * Generated class for the QuestionListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-question-list',
  templateUrl: 'question-list.html',
})
export class QuestionListPage {

  topicName: string;
  corrTopicName: string;

  helper: any;
  ref: any;
  betaItems: any;
  items: any;
  jsonArray = new Array();
  refresh: boolean;
  wait: boolean;

  searchQuery: string = '';
  searchItems = new Array();
  isSearchbarOpened = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.refresh = false;
    this.wait = true;
    this.getData();
  }

  /**
   *  Data from firebase.
   *  If report number >= 5, is not listed.
   */
  getData() {
    this.topicName = localStorage.getItem('topic');
      this.corrTopicName = 'topics/' + this.topicName + '/';
      this.ref = firebase.database().ref(this.corrTopicName);

      this.ref
        .once('value')
        .then(res => {
          this.betaItems = convertArray(res);

          for (let prop in this.betaItems) {
            this.helper = this.betaItems[prop];
            if (+this.helper.report >= 5) {
              this.betaItems.splice(prop, 1);
            }
          }

          this.betaItems.reverse();
          this.items = this.betaItems;

          if (this.items == null || this.items == undefined) {
            this.refresh = true;
          }

          for (let prop in this.items) {
            this.helper = this.items[prop];
          }

          this.wait = false;
        }).catch(err => {
          console.log('websocket');
          this.wait = false;
          this.refresh = true;
        });

  }

  getItems(ev: any) {
    // set val to the value of the searchbar
    this.searchItems = [];
    const val = ev.target.value;
    var modifiedVal;
    console.log("searched val: ", val);
    if (val != '' && val != undefined) {
      for (let prop in this.items) {
        this.helper = this.items[prop];
        modifiedVal = val.charAt(0).toUpperCase() + val.slice(1); // First character uppercase
        if (this.helper.question.match(val) || this.helper.question.match(modifiedVal)) {
          this.searchItems.push(this.helper);
        }
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestionListPage');
  }

  openQuestionPage(index) {
    console.log("openQuestionPage");
    this.helper = this.items[index];

    this.jsonArray[0] = this.helper.id;
    this.jsonArray[1] = this.helper.question;
    this.jsonArray[2] = this.helper.firstAnswer;
    this.jsonArray[3] = this.helper.secondAnswer;
    this.jsonArray[4] = this.helper.thirdAnswer;
    this.jsonArray[5] = this.helper.firstValue;
    this.jsonArray[6] = this.helper.secondValue;
    this.jsonArray[7] = this.helper.thirdValue;
    this.jsonArray[8] = this.helper.author;
    this.jsonArray[9] = this.helper.report;
    this.jsonArray[10] = this.helper.create;
    this.jsonArray[11] = this.helper.modified;
    this.jsonArray[12] = this.helper.catOne;
    this.jsonArray[13] = this.helper.catTwo;
    this.jsonArray[14] = this.helper.catThree;
    this.jsonArray[15] = this.helper.countries;
    this.jsonArray[16] = this.helper.coValues;
    this.jsonArray[17] = this.helper.key;

    console.log("key: ", this.helper.key);

    localStorage.setItem('jsonArray', JSON.stringify(this.jsonArray));
    this.navCtrl.push(QuestionPage);
  }

  openSearchedQuestionPage(index) {
    console.log("openSearchedQuestionPage");
    this.helper = this.searchItems[index];

    this.jsonArray[0] = this.helper.id;
    this.jsonArray[1] = this.helper.question;
    this.jsonArray[2] = this.helper.firstAnswer;
    this.jsonArray[3] = this.helper.secondAnswer;
    this.jsonArray[4] = this.helper.thirdAnswer;
    this.jsonArray[5] = this.helper.firstValue;
    this.jsonArray[6] = this.helper.secondValue;
    this.jsonArray[7] = this.helper.thirdValue;
    this.jsonArray[8] = this.helper.author;
    this.jsonArray[9] = this.helper.report;
    this.jsonArray[10] = this.helper.create;
    this.jsonArray[11] = this.helper.modified;
    this.jsonArray[12] = this.helper.catOne;
    this.jsonArray[13] = this.helper.catTwo;
    this.jsonArray[14] = this.helper.catThree;
    this.jsonArray[15] = this.helper.countries;
    this.jsonArray[16] = this.helper.coValues;
    this.jsonArray[17] = this.helper.key;

    console.log("key: ", this.helper.key);

    localStorage.setItem('jsonArray', JSON.stringify(this.jsonArray));
    this.navCtrl.push(QuestionPage);
  }

  doRefresh(event?) {
    console.log('Begin async operation');
    this.getData();
    event.complete();
  }
}
