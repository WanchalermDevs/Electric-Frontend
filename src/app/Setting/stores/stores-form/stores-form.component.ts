import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HabitatService } from 'src/app/services/habitat.service';
import { NgForm } from '@angular/forms';
import { ElectricalMeterService } from '../../../services/electrical-meter.service';

@Component({
  selector: 'app-stores-form',
  templateUrl: './stores-form.component.html',
  styleUrls: ['./stores-form.component.css']
})
export class StoresFormComponent implements OnInit {

  buildingList: any = [];
  meterList: any = [];

  constructor(private habitatService: HabitatService, private router: Router, private electricalMeterService: ElectricalMeterService) { }

  ngOnInit() {
    this.setBuildingSelector();
    this.setMeterSelector();
  }

  roomSubmit(roomForm: NgForm) {
    // tslint:disable-next-line:max-line-length
    this.habitatService.createRoom(roomForm['buildingID'], roomForm['roomCode'], roomForm['roomName'], 'Stores', roomForm['meterID']).then(async response => {
      this.router.navigateByUrl('/การตั้งค่า/ร้านค้า');
    });
  }

  setMeterSelector() {
    this.electricalMeterService.getElecticalMeterList().then(responseMeter => {
      if (responseMeter['operation'] === 'success') {
        this.meterList = responseMeter['list'];
        console.log(this.meterList);
      } else {

      }
    });
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
