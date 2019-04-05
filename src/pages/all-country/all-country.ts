import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AllCountryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-country',
  templateUrl: 'all-country.html',
})
export class AllCountryPage {

  items: any;
  empty = new Array();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillEnter(){
    this.listCountries();
    this.empty = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllCountryPage');
  }

  listCountries(){
    this.items = JSON.parse(localStorage.getItem('allCountry'));
  }

}
