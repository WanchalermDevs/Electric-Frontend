import { Routes } from '@angular/router';

import { StoresUsageComponent } from './stores-usage/stores-usage.component';
import { DomeUsageComponent } from './dome-usage/dome-usage.component';

export const ElectricityUsageRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'หอพัก',
                component: DomeUsageComponent
            },
            {
                path: 'ร้านค้า',
                component: StoresUsageComponent
            }
        ]
    }
];
