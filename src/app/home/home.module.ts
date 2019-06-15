import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { MaterialModule } from '../app.module';

import { HomeComponent } from './home.component';
import { HomeRoutes } from './home.routing';
import { PeroidDashboardComponent } from './peroid-dashboard/peroid-dashboard.component';
import { ElectricityUsedFormComponent } from './electricity-used-form/electricity-used-form.component';
import { GenerateBillPaymentComponent } from './generate-bill-payment/generate-bill-payment.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(HomeRoutes),
        FormsModule,
        MdModule,
        MaterialModule
    ],
    declarations: [HomeComponent, PeroidDashboardComponent, ElectricityUsedFormComponent, GenerateBillPaymentComponent]
})
export class HomeModule {}
