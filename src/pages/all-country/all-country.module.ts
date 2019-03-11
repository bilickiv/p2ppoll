import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllCountryPage } from './all-country';

@NgModule({
  declarations: [
    AllCountryPage,
  ],
  imports: [
    IonicPageModule.forChild(AllCountryPage),
  ],
})
export class AllCountryPageModule {}
