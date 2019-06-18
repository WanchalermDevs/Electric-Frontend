import { Component, OnInit } from '@angular/core';
import { ElectricalMeterService } from '../../services/electrical-meter.service';
import { HabitatService } from '../../services/habitat.service';
import { PDFGenteratorService } from '../../services/pdfgenterator.service';
import { PeriodService } from '../../services/period.service';
import { RenterService } from '../../services/renter.service';
import { DormitoryLiveService } from '../../services/dormitory-live.service';
import { BillPaymentService } from '../../services/bill-payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';


@Component({
  selector: 'app-generate-bill-payment',
  templateUrl: './generate-bill-payment.component.html',
  styleUrls: ['./generate-bill-payment.component.css']
})
export class GenerateBillPaymentComponent implements OnInit {

  periodID: any;
  periodInfo: any = { code: '', name: '', agent: { agent_k: false, agent_c: false } };
  meterList: any = [];
  meterUsedList: any = [];
  meter: any;
  studentList: any = [];
  buildingList: any = [];
  oldElectricMeterList: any = [];
  billPaymentList: any = [];
  myname: any = '';
  payMetername = '';
  meter_fee_type = '';
  meter_fee = 0;

  averagePrice = 0;
  uinitUsed = 0;
  totalPrice = 0;
  totalPriceMustPay = 0;
  electricUsed = {
    oldUnit: 0,
    currentUnit: 0
  };

  constructor(
    private electricalMeterService: ElectricalMeterService,
    private habitatService: HabitatService,
    private pdfGenterator: PDFGenteratorService,
    private periodService: PeriodService,
    private renterService: RenterService,
    private activatedRoute: ActivatedRoute,
    private dormitoryLiveService: DormitoryLiveService,
    private billPaymentService: BillPaymentService
  ) { }

  ngOnInit() {
    this.myname = window.localStorage.getItem('thai_name');
    this.activatedRoute.params.subscribe(param => {
      this.periodID = atob(param['id']);
      this.periodService.getAPeroidPay(this.periodID).then(periodResponse => {
        this.periodInfo = periodResponse['list'][0];
        this.periodInfo['agent'] = JSON.parse(this.periodInfo['agent']);
        this.periodInfo['unit_price'] = parseInt(this.periodInfo['unit_price'], 10).toFixed(2);
        // console.log(this.periodInfo);
        this.setOleUnit();
        this.electricalMeterService.getElecticalMeterList().then(meterResponse => {
          this.meterList = meterResponse['list'];
        });

        // tslint:disable-next-line:max-line-length
        this.dormitoryLiveService.getAllStudentDorm(this.periodInfo['edu_year'], this.periodInfo['edu_semester']).then(responseStudentList => {
          // ค้นหารายชื่อนักเรียนหอพักที่นี่
          console.log(responseStudentList);
          this.studentList = responseStudentList['list'];
        });

        this.habitatService.getAllBuilding().then((responseBuilding: any = []) => {
          // console.log(responseBuilding);
          if (responseBuilding['list'].length > 0) {
            responseBuilding['list'].forEach(building => {
              this.buildingList[building['id']] = building;
            });
          }
        });

        this.periodService.getElectricUsedList(this.periodID).then(electricUsedResponse => {
          if (electricUsedResponse['list'].length > 0) {
            electricUsedResponse['list'].forEach(used => {
              this.meterUsedList[used['code']] = used;
            });
          }
        });
      });
    });
  }

  searchMeter(form: NgForm) {
    this.billPaymentList = [];
    this.meter = this.meterList[form['meterID']];
    this.electricUsed.currentUnit = this.meterUsedList[this.meter['code']]['used'];
    this.electricUsed.oldUnit = this.oldElectricMeterList[this.meter['code']]['used'];
    // console.log('Meter: ', this.meter);
    this.habitatService.getRoomOrStoreInfoByMeterId(this.meter['id']).then(async (hResponse: any = []) => {
      if (hResponse.length > 0) {
        hResponse.forEach(element => {
          // console.log('ห้องที่ใช้มิเตอร์: ', element);
          // console.log('อาคาร: ', this.buildingList[element['parent_id']]['text']);
          if (element['type'] === 'Room') {
            this.meter_fee_type = 'หอพักนักเรียน';
            this.meter_fee = 5;
          } else if (element['type'] === 'Stores') {
            this.meter_fee_type = 'ร้านค้า';
            this.meter_fee = 10;
          }
          this.pushBillPaymentList(element, this.buildingList[element['parent_id']]['text']);
        });
        // console.log('จำนวนักเรียน :', this.billPaymentList);
        this.uinitUsed = this.electricUsed.currentUnit - this.electricUsed.oldUnit;
        this.totalPriceMustPay = (this.uinitUsed * this.periodInfo['unit_price']);
        this.averagePrice = await Math.floor(this.totalPriceMustPay / this.billPaymentList.length);
        this.totalPriceMustPay += this.meter_fee;
        this.setElectricalAmount(this.averagePrice);
        this.totalPrice = this.averagePrice * this.billPaymentList.length;
      } else {
        alert('ไม่พบว่ามีห้องพัก หรือร้านค้าไหนใช้มิเตอร์นี้');
      }
    });
  }

  async setOleUnit() {
    if (this.periodInfo['previous_period'] === -1) {
      // console.log('previous_period is null');
    } else {
      await this.periodService.getElectricUsedList(this.periodInfo['previous_period']).then(responseOldList => {
        if (responseOldList['list'].length > 0) {
          responseOldList['list'].forEach(oldMeter => {
            this.oldElectricMeterList[oldMeter['code']] = oldMeter;
          });
        }
      });
    }
  }

  payMeter(id) {
    if (this.billPaymentList.length > 0) {
      this.billPaymentList.forEach((element, index) => {
        if (element['studentCode'] === id) {
          this.billPaymentList[index]['meter_fee'] = true;
          // console.log(this.billPaymentList[index]);
          this.payMetername = this.billPaymentList[index]['studentCode'] + ' ' + this.billPaymentList[index]['studentName'];
        } else {
          this.billPaymentList[index]['meter_fee'] = false;
        }
      });
      let tempTotalPrice = this.averagePrice * this.billPaymentList.length;
      this.billPaymentList.forEach((element, index) => {
        if (element['meter_fee'] === true) {
          tempTotalPrice += this.meter_fee;
        }
        if (element['increase'] === true) {
          tempTotalPrice++;
        }
      });
      this.totalPrice = tempTotalPrice;
    }
    this.setElectricalAmount(this.averagePrice);
  }

  increasePay(id, checked) {
    if (this.billPaymentList.length > 0) {
      this.billPaymentList.forEach((element, index) => {
        if (element['studentCode'] === id) {
          this.billPaymentList[index]['increase'] = checked;
        }
      });
      let tempTotalPrice = this.averagePrice * this.billPaymentList.length;
      this.billPaymentList.forEach((element, index) => {
        if (element['increase'] === true) {
          tempTotalPrice++;
        }
        if (element['meter_fee'] === true) {
          tempTotalPrice += this.meter_fee;
        }
      });
      this.totalPrice = tempTotalPrice;
    }
    this.setElectricalAmount(this.averagePrice);
  }

  setElectricalAmount(amount) {
    if (this.billPaymentList.length > 0) {
      this.billPaymentList.forEach((element, index) => {
        this.billPaymentList[index]['electric_amount'] = amount;
        this.billPaymentList[index]['amount'] = amount;
        if (this.billPaymentList[index]['increase'] === true) {
          this.billPaymentList[index]['amount']++;
        }
        if (this.billPaymentList[index]['meter_fee'] === true) {
          this.billPaymentList[index]['amount'] += 5;
        }
      });
      // console.log('ปรับใหม่ ', this.billPaymentList);
    }
  }

  pushBillPaymentList(room, buildingName) {
    if (room['type'] === 'Room') {
      // console.log('หอพัก: ', this.studentList);
      this.studentList.forEach(student => {
        // console.log(student);
        // tslint:disable-next-line:max-line-length
        const studentLiveRoom = student['habitat_id'];
        const roomCheck = room['id'];
        // console.log(roomCheck);
        if (studentLiveRoom === roomCheck) {
          // console.log(roomCheck, student['student_dormitory_name']);
          const tempInfo = {
            type: room['type'],
            ref1: '',
            ref2: '',
            pn: '',
            roomName: roomCheck,
            studentCode: student['student_code'],
            studentName: student['student_name'],
            period_id: this.periodInfo['id'],
            period_code: this.periodInfo['code'],
            period_name: this.periodInfo['name'],
            date_pay_start: this.periodInfo['date_start_pay'],
            date_pay_end: this.periodInfo['date_last_pay'],
            agent: JSON.stringify(this.periodInfo['agent']),
            electric_amount: 0,
            increase: false,
            meter_fee: false,
            meter_id: this.meter['id'],
            officer: window.localStorage.getItem('thai_name'),
            officer_position: window.localStorage.getItem('user_position'),
            token: window.localStorage.getItem('token'),
            edu_year: this.periodInfo['edu_year'],
            edu_semester: this.periodInfo['edu_semester'],
            room_id: room['id'],
            room_code: room['code'],
            room_name: room['text'],
            amount: 0,
          };
          this.billPaymentList.push(tempInfo);
        }
      });
    } else if (room['type'] === 'Stores') {

    }
  }

  downloadFile() {

    // this.billPaymentService.createBillPament(this.billPaymentList).then(billResponse => {
    //   console.log(billResponse);
    // });
    
    const filename = 'excel-' + moment() + '.xlsx';
    this.pdfGenterator.downloadExcel(16, 50).subscribe(
      (data) => {
        console.log(data);
        // saveAs(data, filename);
        const a = document.createElement('a');
        // a.style = "display: none";
        const blob = new Blob([data.blob()], { type: 'octet/stream' });
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      err => {
        alert('Problem while downloading the file.');
        console.error(err);
      }
    );
    // const filename = 'testFile-2.pdf';
    // this.pdfGenterator.downloadReport(filename).subscribe(
    //   (data) => {
    //     console.log(data);
    //     // saveAs(data, filename);
    //     const a = document.createElement('a');
    //     // a.style = "display: none";
    //     const blob = new Blob([data.blob()], {type: 'octet/stream'});
    //     const url = window.URL.createObjectURL(blob);
    //     a.href = url;
    //     a.download = filename;
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //   },
    //   err => {
    //     alert('Problem while downloading the file.');
    //     console.error(err);
    //   }
    // );
    
  }

}
