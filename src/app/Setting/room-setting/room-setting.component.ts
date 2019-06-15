import { Component, OnInit, ViewChild } from '@angular/core';
import { HabitatService } from '../../services/habitat.service';
import { FormControl, FormGroup, Validators, NgForm, FormBuilder } from '@angular/forms';
import { RoomTableComponent } from '../room-table/room-table.component';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare const $: any;

@Component({
  selector: 'app-room-setting',
  templateUrl: './room-setting.component.html',
  styleUrls: ['./room-setting.component.css']
})
export class RoomSettingComponent implements OnInit {

  buildingList: any = [];
  roomDataTable: DataTable;
  @ViewChild('roomTable') roomTableComponent: RoomTableComponent;

  constructor(private habitatService: HabitatService) {

  }

  ngOnInit() {
    this.setBuildingSelector();
  }

  resetForm(roomForm, $event) {
    roomForm.reset();
    $event.preventDefault();
    // tslint:disable-next-line:forin
    for (const name in roomForm.controls) {
      roomForm.controls[name].setErrors(false);
    }
    $('#btn-submit').prop('disabled', true);
  }

  roomSubmit(roomForm: NgForm) {
    // tslint:disable-next-line:max-line-length
    // this.habitatService.createRoom(roomForm['buildingID'], roomForm['roomCode'], roomForm['roomName'], roomForm['roomType']).then(async response => {
    //   await this.roomTableComponent.setRoomTable();
    // });
  }

  setBuildingSelector() {
    this.habitatService.getAllBuilding().then(response => {
      if (response['operation'] === 'success') {
        this.buildingList = response['list'];
      } else {

      }
    });
  }

}
