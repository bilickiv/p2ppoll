/*
  Not Used
  */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.blue = false;
    this.red = false;
    this.green = false;
    this.orange = false;
  }

  ionViewWillEnter(){
    this.setData();
  }

  setData(){
  
  }



  choose(name: string){
    if (name == 'blue') {
      this.blue = true;
      this.red = false;
      this.green = false;
      this.orange = false;
    }
    else if (name == 'red') {
      this.red = true;
      this.blue = false;      
      this.green = false;
      this.orange = false;
    } 
    else if (name == 'green') {
      this.green = true;
      this.blue = false;
      this.red = false;
      this.orange = false;
    }
    else if (name == 'orange') {
      this.orange = true;
      this.blue = false;
      this.red = false;
      this.green = false;
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
