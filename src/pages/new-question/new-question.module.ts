import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewQuestionPage } from './new-question';

@NgModule({
  declarations: [
    NewQuestionPage,
  ],
  imports: [
    IonicPageModule.forChild(NewQuestionPage),
  ],
})
export class NewQuestionPageModule {}
