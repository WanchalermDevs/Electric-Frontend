// import { FormGroup, NgForm } from '@angular/forms';
import { FormControl, FormGroup, Validators, NgForm, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { HabitatService } from '../../services/habitat.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-building-setting',
  templateUrl: './building-setting.component.html',
  styleUrls: ['./building-setting.component.css']
})
export class BuildingSettingComponent implements OnInit {

  buildingList: any = [];

  constructor(private habitatService: HabitatService) { }

  ngOnInit() {
    this.setBuildingTable();
  }

  buildingFromSubmit(buildingForm: NgForm) {
    this.habitatService.createBuilding(buildingForm['code'], buildingForm['name']).then(response => {
      if (response['operation'] === 'success') {
        swal({
          title: 'บันทึกข้อมูลสำเร็จ',
          text: '',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        });
        this.setBuildingTable();
      } else {
        alert('ไม่สามารถบันทึกข้อมูลได้ เนื่องจากระบบขัดข้อง');
      }
    });
  }

  setBuildingTable() {
    this.habitatService.getAllBuilding().then(response => {
      if (response['operation'] === 'success') {
        this.buildingList = response['list'];
      } else {

      }
    });
  }

  deleteBuilding(buildingId, buildingCode, buildingName) {
    swal({
      title: 'ลบข้อมูล!',
      text: 'คุณต้องการลบข้อมูล\rอาคาร ' + buildingCode + ' ' + buildingName,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ใช่ ลบข้อมูลเดี๋ยวนี้',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.habitatService.deleteABuilding(buildingId).then(response => {
          if (response['operation'] === 'success') {
            swal({
              title: 'การลบข้อมูล สำเร็จ!',
              type: 'success',
              confirmButtonClass: 'btn btn-success',
              buttonsStyling: false
            });
            this.setBuildingTable();
          }
        });
      }
    });
  }
}
