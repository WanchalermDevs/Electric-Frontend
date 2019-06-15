
import { Routes } from '@angular/router';

import { BuildingSettingComponent } from './building-setting/building-setting.component';
import { RoomSettingComponent } from './room-setting/room-setting.component';
import { HabitatComponent } from './habitat/habitat.component';
import { ElecticalMetterComponent } from './electical-metter/electical-metter.component';
import { ElectricalMeterFormComponent } from './electrical-meter-form/electrical-meter-form.component';
import { PeriodComponent } from './periods/period/period.component';
import { PeriodFormComponent } from './periods/period-form/period-form.component';
import { PeriodInfoComponent } from './periods/period-info/period-info.component';

import { RoomComponent } from './rooms/room/room.component';
import { RoomFormComponent } from './rooms/room-form/room-form.component';
import { RoomInfoComponent } from './rooms/room-info/room-info.component';

import { CustomerDashboardComponent } from '../customer/customer-dashboard/customer-dashboard.component';
import { combineAll } from 'rxjs/operators';

import { StoresComponent } from './stores/stores/stores.component';
import { StoresFormComponent } from './stores/stores-form/stores-form.component';


export const SettingRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'เพิ่มข้อมูลอาคาร',
                component: BuildingSettingComponent
            },
            {
                path: 'เพิ่มข้อมูลห้อง',
                component: RoomSettingComponent
            },
            {
                path: 'อาคาร-สถานที่',
                component: HabitatComponent
            },
            {
                path: 'ผู้ใช้ไฟฟ้า',
                component: CustomerDashboardComponent
            },
            {
                path: 'มิเตอร์',
                component: ElecticalMetterComponent
            },
            {
                path: 'แบบฟอร์มมิเตอร์ไฟฟ้า',
                component: ElectricalMeterFormComponent
            },
            {
                path: 'แบบฟอร์มมิเตอร์ไฟฟ้า/:id',
                component: ElectricalMeterFormComponent
            },
            {
                path: 'รอบบัญชี',
                component: PeriodComponent
            },
            {
                path: 'รอบบัญชี/ข้อมูล/:id',
                component: PeriodInfoComponent
            },
            {
                path: 'รอบบัญชี/แบบอฟร์ม',
                component: PeriodFormComponent
            },
            {
                path: 'รอบบัญชี/แบบอฟร์ม/:id',
                component: PeriodFormComponent
            },
            {
                path: 'ห้องพัก',
                component: RoomComponent
            },
            {
                path: 'ห้องพัก/แบบฟอร์มห้องพัก',
                component: RoomFormComponent
            },
            {
                path: 'ร้านค้า',
                component: StoresComponent
            },
            {
                path: 'ร้านค้า/แบบฟอร์มร้านค้า',
                component: StoresFormComponent
            }
        ]
    }
];
