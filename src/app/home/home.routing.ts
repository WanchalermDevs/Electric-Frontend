import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { PeroidDashboardComponent } from './peroid-dashboard/peroid-dashboard.component';
import { ElectricityUsedFormComponent } from './electricity-used-form/electricity-used-form.component';
import { GenerateBillPaymentComponent } from './generate-bill-payment/generate-bill-payment.component';

export const HomeRoutes: Routes = [
    {

        path: '',
        children: [
            {
                path: 'สารสนเทศ',
                component: HomeComponent
            },
            {
                path: 'ข้อมูลการใช้ไฟฟ้า/:id',
                component: PeroidDashboardComponent
            },
            {
                path: 'แบบฟอร์มบันทึกการใช้ไฟฟ้า/:id',
                component: ElectricityUsedFormComponent
            },
            {
                path: 'ออกใบแจ้งชำระเงิน/:id',
                component: GenerateBillPaymentComponent
            }
        ]
    }
];
