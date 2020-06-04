import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkstatusPage } from './workstatus';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    WorkstatusPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkstatusPage),
    IonicSelectableModule
  ],
})
export class WorkstatusPageModule {}
