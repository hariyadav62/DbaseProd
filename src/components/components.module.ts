import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TimechartComponent } from './timechart/timechart';
import { PiechartcompComponent } from './piechartcomp/piechartcomp';
import { CommonModule } from '@angular/common';
import { SalaryDetailsComponent } from './salary-details/salary-details';
// import { DropdownComponent } from './dropdown/dropdown';  
@NgModule({
	declarations: [TimechartComponent,
    PiechartcompComponent,
    SalaryDetailsComponent], 
	imports: [CommonModule,IonicModule], 
	exports: [TimechartComponent,
    PiechartcompComponent,
    SalaryDetailsComponent]
})
export class ComponentsModule {}
