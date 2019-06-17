import { Component, OnInit } from '@angular/core';
import { HabitatService } from '../../services/habitat.service';
import { RenterService } from '../../services/renter.service';
import { NgForm } from '@angular/forms';
import { DormitoryLiveService } from '../../services/dormitory-live.service';

@Component({
  selector: 'app-student-dorm-form',
  templateUrl: './student-dorm-form.component.html',
  styleUrls: ['./student-dorm-form.component.css']
})
export class StudentDormFormComponent implements OnInit {
  buildingList: any = [];
  studentName: any = '';
  studentInfo: any;

  constructor(
    private habitatService: HabitatService,
    private renter: RenterService,
    private dormitoryLiveService: DormitoryLiveService
  ) { }

  ngOnInit() {
    this.setBuildingSelector();
  }

  studentFormSubmit(form: NgForm) {
    const param = {
      token: window.localStorage.getItem('token'),
      student_code: this.studentInfo['student_code'],
      student_name: this.studentName,
      room: this.buildingList[form['buildingID']]['text'],
      edu_semester: form['semester'],
      edu_year: form['year'],
      type: this.buildingList[form['buildingID']]['type'],
      habitat_id: this.buildingList[form['buildingID']]['id'],
      booking_code: this.studentInfo['student_code'] + '-' + form['year'] + '-' + form['semester']
    };
    this.dormitoryLiveService.recordStudentDorminitory(param).then(response => {
      console.log(response);
    })
  }

  setBuildingSelector() {
    this.habitatService.getAllRoom().then(response => {
      console.log('Room: ', response);
      this.buildingList = response;
    });
  }

  loadStudent(studentCode, year) {
    console.log(studentCode);
    this.renter.getStudentInfo(studentCode, year).then(response => {
      console.log(response['info'][0]);
      const student = response['info'][0];
      this.studentInfo = student;
      this.studentName = student['student_pre_name'] + student['student_first_name'] + ' ' + student['student_last_name'];
    });
  }

}
