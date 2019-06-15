import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { MaterialModule } from '../app.module';

import { SettingRoutes } from './setting.routing';
import { BuildingSettingComponent } from './building-setting/building-setting.component';
import { HabitatComponent } from './habitat/habitat.component';
import { HabitatTableComponent } from './habitat-table/habitat-table.component';
import { RoomSettingComponent } from './room-setting/room-setting.component';
import { LevelSettingComponent } from '../Setting/level-setting/level-setting.component';
import { RoomTableComponent } from '../Setting/room-table/room-table.component';
import { StoresSettingComponent } from '../Setting/stores-setting/stores-setting.component';
import { StoresTableComponent } from '../Setting/stores-table/stores-table.component';
import { CustomerDashboardComponent } from '../customer/customer-dashboard/customer-dashboard.component';
import { ElecticalMetterComponent } from '../Setting/electical-metter/electical-metter.component';
import { ElectricalMeterFormComponent } from '../Setting/electrical-meter-form/electrical-meter-form.component';
import { PeriodComponent } from '../Setting/periods/period/period.component';
import { PeriodFormComponent } from '../Setting/periods/period-form/period-form.component';
import { PeriodInfoComponent } from '../Setting/periods/period-info/period-info.component';
import { RoomComponent } from '../Setting/rooms/room/room.component';
import { RoomInfoComponent } from '../Setting/rooms/room-info/room-info.component';
import { RoomFormComponent } from '../Setting/rooms/room-form/room-form.component';
import { StoresComponent } from '../Setting/stores/stores/stores.component';
import { StoresFormComponent } from '../Setting/stores/stores-form/stores-form.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(SettingRoutes),
        FormsModule,
        MdModule,
        MaterialModule,
        ReactiveFormsModule
    ],
    declarations: [
        BuildingSettingComponent,
        HabitatComponent,
        HabitatTableComponent,
        LevelSettingComponent,
        RoomSettingComponent,
        RoomTableComponent,
        StoresSettingComponent,
        StoresTableComponent,
        CustomerDashboardComponent,
        ElecticalMetterComponent,
        ElectricalMeterFormComponent,
        PeriodComponent,
        PeriodFormComponent,
        PeriodInfoComponent,
        RoomComponent,
        RoomInfoComponent,
        RoomFormComponent,
        StoresComponent,
        StoresFormComponent,
    ]
})
export class SettingModule { }
