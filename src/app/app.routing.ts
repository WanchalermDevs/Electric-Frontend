import { SettingRoutes } from './Setting/setting.routing';
import { Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';


export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: '/สารสนเทศ',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [ AuthGuard ],
        children: [
            {
                path: '',
                loadChildren: './home/home.module#HomeModule'
            },
            {
                path: 'บันทึกการใช้ไฟฟ้า',
                loadChildren: './ElectricityUsage/electricity-usage.module#ElectricityUsageModule'
            },
            {
                path: 'การตั้งค่า',
                loadChildren: './Setting/setting.module#SettingModule'
            }
        ]
    }, {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'pages',
                loadChildren: './pages/pages.module#PagesModule'
            }
        ]
    }
];
