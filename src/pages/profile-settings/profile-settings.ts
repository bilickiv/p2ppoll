import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { convertArray } from '../../app/envrionment';

/**
 * Generated class for the ProfileSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-settings',
  templateUrl: 'profile-settings.html',
})
export class ProfileSettingsPage {
  country: string;

  nickName: string;
  oldNickName: string;
  nickNames: any; //Firebase
  sameNickname: boolean;
  helper: any;
  deletedData: any;
  questionNumber: any;
  ref: any;
  month: number;

  changeMonth;
  changeCountry;
  changeNname;

  permission: boolean = true;
  nPermission: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController) {
    this.getData();
    this.dateSetter();
    this.permission = true;
    this.nPermission = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileSettingsPage');
  }

  select() {
    this.storage.set('country', this.country);
    this.storage.set('changeCountry', this.changeCountry+1);
    this.storage.set('changeMonth', this.month);
  }

  dateSetter(){
      let date: Date = new Date();
      console.log("Date = " + date);
      this.month = date.getMonth() + 1;
  }

  /*
  * This method check nickname and country name change count, if permission == false, ngIf hide ion-item
  */

  getData() {
    this.storage.get('country').then((val) => {
      this.country = val;
    });
    this.storage.get('nickName').then((val) => {
      this.nickName = val;
    });
    this.storage.get('changeMonth').then((changeMonth) =>{
      this.storage.get('change').then((change)=>{
        this.changeMonth = changeMonth;
        console.log("month", this.changeMonth);
        this.changeCountry = change;
        console.log("change ", this.changeCountry);
        if(this.changeMonth == this.month){
          if(this.changeCountry >= 2){
            this.permission = false;
            console.log("permission ", this.permission);
          }
        }
      });
    });
    this.storage.get('changeNickname').then((changeNickname)=>{
      this.changeNname = changeNickname;
      if(this.changeNname >= 2){
        this.nPermission = false;
      }
    })
    console.log("permission ", this.permission);
  }


  /*
  * sameNickname variable: Firebase check for name match
  */

  changeNickname() {
    this.sameNickname = false;
    this.oldNickName = this.nickName;
    let alert = this.alertCtrl.create({
      title: 'New nickname',
      message: 'Please write a new nickname!',
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
                  if (this.helper.nickname == this.oldNickName) {
                    this.deletedData = this.nickNames[prop];
                  }
                }

                if (this.sameNickname) {
                  this.nickNameError();
                } else {
                  this.storage.set('nickName', data.title);
                  this.nickName = data.title;

                  var jsonFile = {
                    nickname: this.nickName
                  };

                  this.ref = firebase.database().ref("nicknames/");
                  let newItem = this.ref.push();
                  newItem.set(jsonFile);

                  console.log("oldNickname" + this.oldNickName);
                  console.log("deletedData: " + this.deletedData);

                  firebase.database().ref("nicknames/" + this.deletedData.key).remove(); // Delete old nickname from database
                  this.storage.set('changeNickname', this.changeNname+1);
                }
              }).catch(err => {
                console.log('Error');
              });
          }
        },
      ]
    });
    alert.present();
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
          }
        },
      ]
    });
    alert.present();
  }

  changeNicknameAlert() {
    const alert = this.alertCtrl.create({
      title: 'Attention',
      subTitle: 'You can change your nickname twice a month!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          role: 'Ok',
          handler: () => {
            this.changeNickname();
          }
        }
      ]
    });
    alert.present();
  }

  changeCountryAlert() {
    const alert = this.alertCtrl.create({
      title: 'Attention',
      subTitle: 'You can change your country twice a month!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          role: 'Ok',
          handler: () => {
            this.select();
          }
        }
      ]
    });
    alert.present();
  }


}
