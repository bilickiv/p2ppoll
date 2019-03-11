import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategorieChoosePage } from './categorie-choose';

@NgModule({
  declarations: [
    CategorieChoosePage,
  ],
  imports: [
    IonicPageModule.forChild(CategorieChoosePage),
  ],
})
export class CategorieChoosePageModule {}
