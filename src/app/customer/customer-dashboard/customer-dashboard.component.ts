import { Component, OnInit } from '@angular/core';
import { RenterService } from '../../services/renter.service';
import { HabitatService } from '../../services/habitat.service';
import { NgForm } from '@angular/forms';

declare const $: any;

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {

  dormitoryStudentsList = [];
  storesList = [];

  columnsTable = [
    { title: '#', width: '5%' },
    { title: 'อาคาร' },
    { title: 'รหัสห้อง' },
    { title: 'ลำดับ' },
    { title: 'รหัสนักเรียน' },
    { title: 'ชื่อ - นามสกุล', width: '25%' },
    { title: 'ปีการศึกษา' },
    { title: 'ภาคเรียน' }
  ];

  storesColumnsTable = [
    { title: '#', width: '5%' },
    { title: 'อาคาร' },
    { title: 'รหัสร้าน' },
    { title: 'ชื่อร้าน' },
    { visible: false },
    { visible: false },
    { visible: false },
    { visible: false },
  ];

  constructor(private renterService: RenterService, private habitatService: HabitatService) {

  }

  ngOnInit() {
    $('#studentUsageElecticityTable').DataTable({ destroy: true, columns: this.columnsTable, data: [] });
  }

  setEmptyStudentTable() {
    $('#studentUsageElecticityTable').DataTable({ destroy: true, columns: this.columnsTable, data: [] });
  }

  studentSearchFormSubmit(info: NgForm) {
    this.dormitoryStudentsList = [];
    this.renterService.getDormitoryStudentsList(info['edu_year'], info['edu_semester']).then((list) => {
      this.setStudentListArray(list['list'], () => {
        $('#studentUsageElecticityTable').DataTable({
          destroy: true,
          columns: this.columnsTable,
          data: this.dormitoryStudentsList,
        });
      });
    });
  }

  setStudentListArray(list: any[], cb) {
    list.forEach((element, index) => {
      // tslint:disable-next-line:max-line-length
      const data = [(index + 1), element['student_dormitory_building'], element['student_dormitory_floor'] + element['student_dormitory_room'], '-', element['student_dormitory_student_code'], element['student_dormitory_name'], element['student_dormitory_edu_year'], element['student_dormitory_semester']];
      this.dormitoryStudentsList.push(data);
    });
    cb();
  }

  getStoresList() {
    this.storesList = [];
    this.habitatService.getAllStores().then((response) => {
      this.setStoreListArray(response, () => {
        $('#studentUsageElecticityTable').DataTable({
          destroy: true,
          columns: this.storesColumnsTable,
          data: this.storesList,
        });
      });
    });
  }

  setStoreListArray(list, cb) {
    list.forEach((element, index) => {
      const data = [(index + 1), element['parent_id'], element['code'], element['text'], '', '', '', ''];
      this.storesList.push(data);
    });
    cb();
  }

}
