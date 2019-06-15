import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { MaterialModule } from '../app.module';


import { ElectricityUsageRoutes } from './electricity-usage.routing';
import { DomeUsageComponent } from './dome-usage/dome-usage.component';
import { StoresUsageComponent } from './stores-usage/stores-usage.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ElectricityUsageRoutes),
        FormsModule,
        MdModule,
        MaterialModule
    ],
    declarations: [DomeUsageComponent, StoresUsageComponent]
})
export class ElectricityUsageModule {}
