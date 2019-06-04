import { Component, ErrorHandler } from '@angular/core';
import { NavController, MenuController, AlertController, Platform } from 'ionic-angular';
import { QuestionListPage } from '../question-list/question-list';
import { NewQuestionPage } from '../new-question/new-question';
import * as firebase from 'firebase';
import { convertArray } from '../../app/envrionment';
import { ProfileSettingsPage } from '../profile-settings/profile-settings';

@Component({
  selector: 'page-index',
  templateUrl: 'index.html'
})
export class IndexPage {
  topics = new Array();
  topicsHelper = new Array();
  topicNameArray = new Array();
  topicBoolArray = new Array();
  savedQuestions = new Array();
  savedQuestionsIdArray = new Array();
  votedQuestionIds = new Array();
  readedTopics = new Array();
  limits = new Array();
  myQuestions = new Array();

  nickName: string;
  empty: boolean;
  ref: any;
  news: any;
  nickNames: any;
  helper: any;
  topicClassName: string;
  topicClass: any;
  topicIndex: string;
  firstRunCheck: number;
  sameNickname: boolean;
  random: number;
  question: string;
  fullDatabase: any;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public alertCtrl: AlertController, public errHandler: ErrorHandler, public platform: Platform) {

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.initializeArrays();
    this.nicknameSetter();
    this.countryCheck();
  }

  /** 
  * This method check country. If hidden, and random == 7(1/20), then pop up.
  */
  countryCheck() {
    this.random = Math.floor((Math.random() * 20) + 1);
    if (this.random == 7) {
      let country = localStorage.getItem('country');
      if (country == "Hidden" && this.nickName != "Anonym") {
        this.countrySetter();
      }
    }
  }

  downloadFullDatabase(){
    var i = 0;
    this.ref = firebase.database().ref('topics/');
    this.ref
    .once('value')
    .then(res => {
      this.fullDatabase = convertArray(res);
      console.log("fullDatabase");
      console.log(this.fullDatabase);
      for(let prop in this.fullDatabase){
        console.log('Add topic ', this.fullDatabase[prop].key);
        this.topicNameArray[i] = this.fullDatabase[prop].key;
        i++;
      }
      localStorage.setItem('topicNameArray', JSON.stringify(this.topicNameArray));
    }).catch(err => {
      console.log('websocket or internet error');
      localStorage.setItem('firstRunCheck', '0');
      this.internetError();
    });
  }

  /** 
  * This method initialize index page content and database.
  * If this first run, then firstRunCheck variable not 1, start database variables, arrays initalize.
  * Display sort. This method contain firebase reference for new questions. If there is new question, 
  * we change the style.
  */
  initializeArrays() {
    this.firstRunCheck = +localStorage.getItem('firstRunCheck');
    this.nickName = localStorage.getItem('nickName');
    let topicBoolArr = localStorage.getItem('topicBoolArray');
    let topicNameArr = localStorage.getItem('topicNameArray');
    let readedTop = localStorage.getItem('readedTopics');

    if (this.nickName == undefined || this.nickName == null) {
      this.nickName = "Anonym";
    }

    this.topics = [];
    this.topicsHelper = [];
    this.topicNameArray = [];
    this.topicBoolArray = [];
    this.savedQuestions = [];
    this.savedQuestionsIdArray = [];
    this.votedQuestionIds = [];
    this.readedTopics = [];
    this.myQuestions = [];

  /**
   * First run.
   */
    if (this.firstRunCheck != 1) {

      this.topicNameArray = ["animation", "animal", "book", "business", "car", "city", "clothes", "community", "computer",
        "country", "culture", "electronics", "ezoteric", "fashion", "fitness", "food", "friend", "game", "healthy",
        "hobby", "home", "internet", "language", "learning", "life", "love", "money", "movie",
        "music", "nature", "online", "phone", "photo", "problem", "programming",
        "relationship", "school", "science", "social", "technology", "training", "transport", "travel",
        "tvseries", "university", "video", "work"
      ];

      for (var x = 0; x < this.topicNameArray.length; x++) {
        if (x < 15) {
          this.topicBoolArray.push(true);
        } else {
          this.topicBoolArray.push(false);
        }
      }

      this.limits[0] = 1999;
      this.limits[1] = 1;
      this.limits[2] = 1;
      this.limits[3] = 1;
      this.votedQuestionIds.push(0);

      localStorage.setItem('nickName', 'Anonym');
      localStorage.setItem('questionNumber', '0');
      localStorage.setItem('sumcheck', '15');
      localStorage.setItem('voteNumber', '0');
      localStorage.setItem('limit', JSON.stringify(this.limits));
      localStorage.setItem('country', "Hidden");
      localStorage.setItem('myQuestions', JSON.stringify(this.myQuestions));
      localStorage.setItem('votedQuestionIds', JSON.stringify(this.votedQuestionIds));
      localStorage.setItem('savedQuestionsIdArray', JSON.stringify(this.savedQuestionsIdArray));
      localStorage.setItem('savedQuestions', JSON.stringify(this.savedQuestions));
      localStorage.setItem('firstRunCheck', '1');
      localStorage.setItem('topicNameArray', JSON.stringify(this.topicNameArray));
      localStorage.setItem('topicBoolArray', JSON.stringify(this.topicBoolArray));      
    } else {
      this.topicBoolArray = JSON.parse(topicBoolArr);
      this.topicNameArray = JSON.parse(topicNameArr);
      this.readedTopics = JSON.parse(readedTop);

      let sum = +localStorage.getItem('sumcheck');
      if (sum == 0) {
        this.empty = true;
      } else {
        this.empty = false;
      }
    }

    var y = 0;
    for (var x = 0; x < this.topicBoolArray.length; x++) {
      if (this.topicBoolArray[x]) { // Just selected topics name 
        this.topics[y] = this.topicNameArray[x];
        y++;
      }
    }

    var j, tmp;
    for (var i = this.topics.length - 1; 0 < i; --i) { //Sort by text length
      for (j = 0; j < i; ++j) {
        if (this.topics[j].length < this.topics[j + 1].length) {
          tmp = this.topics[j];
          this.topics[j] = this.topics[j + 1];
          this.topics[j + 1] = tmp;
        }
      }
    }

    for (i = 0; i < this.topics.length; i++) { //Helper Array to sort (design)
      console.log(this.topics[i]);
      this.topicsHelper[i] = this.topics[i];
    }

    if (this.topics.length >= 5 && this.topics.length <= 9) {  //Display Sort1
      this.topics[9] = this.topics[4];
      this.topics[4] = "";
      if (this.topics.length >= 6) {
        this.topics[10] = this.topics[5];
        this.topics[5] = "";
        if (this.topics.length >= 7) {
          this.topics[4] = this.topics[6];
          this.topics[6] = "";
          if (this.topics.length >= 8) {
            this.topics[11] = this.topics[7];
            this.topics[7] = "";
          }
        }
      }
    }

    if (this.topics.length >= 10 && this.topics.length <= 12) {  //Display Sort2
      this.topics[3] = this.topicsHelper[1];
      this.topics[4] = this.topicsHelper[2];
      this.topics[2] = this.topicsHelper[3];
      this.topics[8] = this.topicsHelper[4];
      this.topics[5] = this.topicsHelper[5];
      this.topics[6] = this.topicsHelper[6];
      this.topics[11] = this.topicsHelper[7];
      this.topics[12] = this.topicsHelper[8];
      this.topics[13] = this.topicsHelper[9];
      this.topics[1] = this.topicsHelper[0];
      this.topics[0] = "";
      this.topics[7] = "";
      this.topics[9] = "";
      if (this.topics.length >= 11) {
        this.topics[14] = this.topicsHelper[10];
        this.topics[10] = "";
        if (this.topics.length >= 12) {
          this.topics[7] = this.topicsHelper[11];
        }
      }
    }

    this.setBasicState(this.topics);

    this.ref = firebase.database().ref('news/');
    this.ref
      .once('value')
      .then(res => {
        this.news = convertArray(res);

        localStorage.setItem('news', JSON.stringify(this.news));

        for (let prop in this.news) {
          this.helper = this.news[prop];

          for (var x = 0; x < this.topics.length; x++) {

            if (this.topics[x] == this.helper.topic) {

              for (var y = 0; y < this.topicNameArray.length; y++) {

                if (this.topics[x] == this.topicNameArray[y]) { //readedTopics[y]

                  if (this.readedTopics[y] != this.helper.id) {

                    this.topicIndex = x.toString();
                    this.topicClass = document.getElementById(this.topicIndex);
                    this.topicClassName = this.topicClass.className;

                    switch (this.topicClassName) {
                      case "pStyle-1": document.getElementById(this.topicIndex).classList.remove('pStyle-1');
                        document.getElementById(this.topicIndex).classList.add('animatedStyle-1');
                        break;
                      case "pStyle-2": document.getElementById(this.topicIndex).classList.remove('pStyle-2');
                        document.getElementById(this.topicIndex).classList.add('animatedStyle-2');
                        break;
                      case "pStyle-3": document.getElementById(this.topicIndex).classList.remove('pStyle-3');
                        document.getElementById(this.topicIndex).classList.add('animatedStyle-3');
                        break;
                      case "overStyle": document.getElementById(this.topicIndex).classList.remove('overStyle');
                        document.getElementById(this.topicIndex).classList.add('animatedOverStyle');
                        break;
                      default:
                        break;
                    }
                  }
                }
              }
            }
          }
        }
      }).catch(err => {
        console.log('websocket');
      });

    localStorage.setItem('readedTopics', JSON.stringify(this.readedTopics));
    this.downloadFullDatabase();
  }

  /*
  * Set basic state of topics on display.
  */

  setBasicState(topics: any) {
    for (var i = 0; i < topics.length; i++) {
      switch (this.topicClassName) {
        case "animatedStyle-1": document.getElementById(this.topicIndex).classList.remove('animatedStyle-1');
          document.getElementById(this.topicIndex).classList.add('pStyle-1');
          break;
        case "animatedStyle-2": document.getElementById(this.topicIndex).classList.remove('animatedStyle-2');
          document.getElementById(this.topicIndex).classList.add('pStyle-2');
          break;
        case "animatedStyle-3": document.getElementById(this.topicIndex).classList.remove('animatedStyle-3');
          document.getElementById(this.topicIndex).classList.add('pStyle-3');
          break;
        case "animatedOverStyle": document.getElementById(this.topicIndex).classList.remove('animatedOverStyle');
          document.getElementById(this.topicIndex).classList.add('overStyle');
          break;
        default:
          break;
      }
    }
  }

  openNewQuestionPage() {
    this.navCtrl.push(NewQuestionPage);
  }

  /*
  * Clicked topic added readedTopics array). 
  */
  openQuestionListPage(topicName: string) {


    let topicNameArray = JSON.parse(localStorage.getItem('topicNameArray'));

    let localNews = localStorage.getItem('news');
    this.news = JSON.parse(localNews);

    let readedTop = JSON.parse(localStorage.getItem('readedTopics'));
    this.readedTopics = readedTop;

    for (let prop in this.news) {

      this.helper = this.news[prop];

      if (this.helper.topic == topicName) {
        for (var x = 0; x < topicNameArray.length; x++) {
          if (topicNameArray[x] == topicName) {

            this.readedTopics[x] = this.helper.id;

            localStorage.setItem('readedTopics', JSON.stringify(this.readedTopics));
          }
        }

        for (x = 0; x < this.topics.length; x++) {

          if (this.topics[x] == this.helper.topic) {
            this.topicIndex = x.toString();
            this.topicClass = document.getElementById(this.topicIndex);
            this.topicClassName = this.topicClass.className;

            switch (this.topicClassName) {
              case "animatedStyle-1": document.getElementById(this.topicIndex).classList.remove('animatedStyle-1');
                document.getElementById(this.topicIndex).classList.add('pStyle-1');
                break;
              case "animatedStyle-2": document.getElementById(this.topicIndex).classList.remove('animatedStyle-2');
                document.getElementById(this.topicIndex).classList.add('pStyle-2');
                break;
              case "animatedStyle-3": document.getElementById(this.topicIndex).classList.remove('animatedStyle-3');
                document.getElementById(this.topicIndex).classList.add('pStyle-3');
                break;
              case "animatedOverStyle": document.getElementById(this.topicIndex).classList.remove('animatedOverStyle');
                document.getElementById(this.topicIndex).classList.add('overStyle');
                break;
            }
          }
        }
      }
    }

    if (this.readedTopics.length != 0) {
      if (this.readedTopics.length > 5000) { // Database field clear, if greater than 5000 item
        var j = 0;
        this.readedTopics = [];
        for (var i = 2500; i < 5000; i++) {
          this.readedTopics[j] = readedTop[i];
          j++;
        }
        localStorage.setItem('readedTopics', JSON.stringify(this.readedTopics));
      }
    }

    localStorage.setItem('topic', topicName);
    this.navCtrl.push(QuestionListPage);
  }

  nicknameSetter() {
    let nickName = localStorage.getItem('nickName');
    if (nickName == null || nickName == 'Anonym') {
      this.nickName = 'Anonym';
      this.generateNickname();
    } else {
      this.nickName = nickName;
    }
  }

  generateNickname() {
    this.sameNickname = false;
    let alert = this.alertCtrl.create({
      title: 'New nickname',
      message: 'Please write a nickname!',
      inputs: [
        {
          name: 'title',
          id: 'maxLength10',
          placeholder: 'Your nickname'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.ref = firebase.database().ref('nicknames/');
            this.ref
              .once('value')
              .then(res => {
                this.nickNames = convertArray(res);
                for (let prop in this.nickNames) {
                  this.helper = this.nickNames[prop];
                  if (this.helper.nickname == data.title) {
                    this.sameNickname = true;
                  }
                }

                var title = data.title;
                console.log("title:", title)

                if (this.sameNickname || data.title == "" || data.title.match(/\s/g)) {
                  this.nickNameError();
                } else {
                  localStorage.setItem('nickName', data.title);
                  this.nickName = data.title;

                  var jsonFile = {
                    nickname: this.nickName
                  };

                  this.ref = firebase.database().ref("nicknames/");
                  let newItem = this.ref.push();
                  newItem.set(jsonFile);
                  this.countrySetter();
                }
              }).catch(err => {
                console.log('Error');
              });
          }
        },
      ]
    });

    alert.present().then(result => {
      document.getElementById('maxLength10').setAttribute('maxLength', '10');
    });
  }

  nickNameError() {
    const alert = this.alertCtrl.create({
      title: 'Failed',
      subTitle: 'This nickname is already taken!',
      buttons: [
        {
          text: 'Ok',
          role: 'Ok',
          handler: () => {
            this.generateNickname();
          }
        }
      ]
    });
    alert.present();
  }

  countrySetter() {
    const alert = this.alertCtrl.create({
      title: 'Country',
      subTitle: 'Please set your country name. If set, you can improve statistics. Thank you!',
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
          handler: () => { }
        },
        {
          text: 'Go Settings',
          role: 'Ok',
          handler: () => {
            this.navCtrl.push(ProfileSettingsPage);
          }
        }
      ]
    });
    alert.present();
  }

  internetError() {
    const alert = this.alertCtrl.create({
      title: 'No Connection',
      subTitle: 'Please check your internet connection, and restart this application!',
      buttons: [
        {
          text: 'Ok',
          role: 'Ok',
          handler: () => {
            this.navCtrl.push(ProfileSettingsPage);
          }
        }
      ]
    });
    alert.present();
  }

}
