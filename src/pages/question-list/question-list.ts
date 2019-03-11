import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuestionPage } from '../question/question';
import { Storage } from '@ionic/storage';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
  }

  ionViewWillEnter() {
    this.refresh = false;
    this.wait = true;
    this.getData();
  }

  getData() {
    this.storage.get('topic').then((val) => {  // Setting topic Name
      this.topicName = val;
      this.corrTopicName = this.topicName + '/';
      this.ref = firebase.database().ref(this.corrTopicName);

      this.ref
        .once('value')
        .then(res => {
          this.betaItems = convertArray(res);

          for (let prop in this.betaItems) {
            this.helper = this.betaItems[prop];
            if(+this.helper.report >= 5){  
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
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestionListPage');
  }

  openQuestionPage(index) {

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

    this.storage.set('jsonArray', this.jsonArray);
    this.navCtrl.push(QuestionPage);
  }

  doRefresh(event?) {
    console.log('Begin async operation');
    this.getData();
    event.complete();
  }
}
