import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NewQuestionPage } from '../new-question/new-question';
import { QuestionListPage } from '../question-list/question-list';

import * as firebase from 'firebase';
import { convertArray } from '../../app/envrionment';

/**
 * Generated class for the HotThemesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info onss
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-top',
  templateUrl: 'top.html',
})
export class TopPage {

  nickName: string;
  topics = new Array();
  news: any;

  public topicNameArray = new Array();
  public topicNumberArray = new Array();
  public dailyTopicsHours = new Array();
  public plusTopics = new Array();
  ref: any;

  year = new Array();
  month = new Array();
  day = new Array();
  hour = new Array();
  minute = new Array();

  helperString: string;

  actualDay: any;
  topicsHelper = new Array();

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TopPage');
  }

  ionViewWillEnter() {
    this.nickName = localStorage.getItem('nickName');
    this.topicsHelper = [];
    this.topicNameArray = [];
    this.topicNumberArray = [];

    this.topics = [];
    this.dailyTopicsHours = [];
    this.plusTopics = [];

    this.year = [];
    this.month = [];
    this.day = [];
    this.hour = [];
    this.minute = [];
    this.initializeTopics();
  }

  initializeTopics() {
    this.ref = firebase.database().ref('news/');
    this.ref
      .once('value')
      .then(res => {
        this.news = convertArray(res);

        for (let prop in this.news) {
          this.topicNameArray.push(this.news[prop].topic);
          this.topicNumberArray.push(+this.news[prop].topics);
        }

        //Firebase jelenlegi tárolása szerint, pontok mentén vágva
        var i, j, tmp;

        for (i = this.topicNumberArray.length - 1; 0 < i; --i) { //Sort by text length
          for (j = 0; j < i; ++j) {
            if (this.topicNumberArray[j] < this.topicNumberArray[j + 1]) {
              tmp = this.topicNumberArray[j];
              this.topicNumberArray[j] = this.topicNumberArray[j + 1];
              this.topicNumberArray[j + 1] = tmp;
              tmp = this.topicNameArray[j];
              this.topicNameArray[j] = this.topicNameArray[j + 1];
              this.topicNameArray[j + 1] = tmp;
            }
          }
        }

        for (i = 0; i < 15; i++) {
          this.topics[i] = this.topicNameArray[i];
        }

        for (i = this.topics.length - 1; 0 < i; --i) { //Sort by text length
          for (j = 0; j < i; ++j) {
            if (this.topics[j].length < this.topics[j + 1].length) {
              tmp = this.topics[j];
              this.topics[j] = this.topics[j + 1];
              this.topics[j + 1] = tmp;
            }
          }
        }
      });
  }


  openNewQuestionPage() {
    this.navCtrl.push(NewQuestionPage);
  }

  openQuestionListPage(topicName: string) {
    localStorage.setItem('topic', topicName);
    this.navCtrl.push(QuestionListPage);
  }



}
