/*
  No Use
  */



import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ThemeSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-theme-settings',
  templateUrl: 'theme-settings.html',
})
export class ThemeSettingsPage {

  blue: boolean;
  red: boolean;
  green: boolean;
  orange: boolean;

  name: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController) {
    this.blue = false;
    this.red = false;
    this.green = false;
    this.orange = false;
  }

  ionViewWillEnter(){
    this.setData();
  }

  setData(){
    this.storage.get('themeColor').then((val)=>{
      switch(val){
        case "themeBlue": this.blue = true;
        break;
        case "themeRed": this.red = true;
        break;
        case "themeGreen": this.green = true;
        break;
        case "themeOrange": this.orange = true;
        break;
      }
    });
  }



  choose(name: string){
    if (name == 'blue') {
      this.blue = true;
      this.red = false;
      this.green = false;
      this.orange = false;
      this.storage.set('themeColor', "themeBlue");
      
    }
    else if (name == 'red') {
      this.red = true;
      this.blue = false;      
      this.green = false;
      this.orange = false;
      this.storage.set('themeColor', "themeRed");
    } 
    else if (name == 'green') {
      this.green = true;
      this.blue = false;
      this.red = false;
      this.orange = false;
      this.storage.set('themeColor', "themeGreen");
    }
    else if (name == 'orange') {
      this.orange = true;
      this.blue = false;
      this.red = false;
      this.green = false;
      this.storage.set('themeColor', "themeOrange");
    }

  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Vote',
      subTitle: 'You have to Vote!',
      buttons: ['OK']
    });
    alert.present();
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ThemeSettingsPage');
  }

}
