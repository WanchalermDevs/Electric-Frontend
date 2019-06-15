import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {

  host: string;

  constructor(private _http: Http) {
    this.host = 'http://localhost:3000/peroid-payment';
  }

  // tslint:disable-next-line:max-line-length
  createNewPeroidPayment(code: any, name: string, edu_year: any, edu_semester: any, date_start_pay: any, date_last_pay: any, date_start_download: any, date_last_download: any, agent: any, operated_person: any, unit_price: any, previous_period: any) {
    const param = {
      token: window.localStorage.getItem('token'),
      code: code,
      name: name,
      edu_year: edu_year,
      edu_semester: edu_semester,
      date_start_pay: date_start_pay,
      date_last_pay: date_last_pay,
      date_start_download: date_start_download,
      date_last_download: date_last_download,
      agent: agent,
      operated_person: operated_person,
      unit_price: unit_price,
      previous_period: previous_period
    };
    return this._Post('/', param);
  }

  getAllPeriodPay() {
    return this._Get('/' + window.localStorage.getItem('token'));
  }

  getAPeroidPay(id) {
    return this._Get('/' + window.localStorage.getItem('token') + '/' + id);
  }

  deleteAPeroidPay(id) {
    return this._Delete('/' + window.localStorage.getItem('token') + '/' + id);
  }

  // tslint:disable-next-line:max-line-length
  editPeriodPay(code: any, name: string, edu_year: any, edu_semester: any, date_start_pay: any, date_last_pay: any, date_start_download: any, date_last_download: any, agent: any, operated_person: any, unit_price: any, id: any, previous_period: any) {
    const param = {
      token: window.localStorage.getItem('token'),
      code: code,
      name: name,
      edu_year: edu_year,
      edu_semester: edu_semester,
      date_start_pay: date_start_pay,
      date_last_pay: date_last_pay,
      date_start_download: date_start_download,
      date_last_download: date_last_download,
      agent: agent,
      operated_person: operated_person,
      unit_price: unit_price,
      id: id,
      previous_period: previous_period
    };
    return this._Put('/', param);
  }

  getElectricUsedList(peroidID) {
    return this._Get('/electric-used-list/' + window.localStorage.getItem('token') + '/' + peroidID);
  }

  saveElectricUsedList(periodID, data) {
    const param = {
      token: window.localStorage.getItem('token'),
      data: JSON.stringify(data),
      periodID: periodID
    };
    return this._Post('/electric-used-list', param);
  }

  private _Get(queryString) {
    return new Promise((resolve, reject) => {
      let headers;
      headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.get(this.host + queryString, { headers: headers }).pipe().subscribe(res => {
        resolve(res.json());
      });
    });
  }

  private _Delete(queryString) {
    return new Promise((resolve, reject) => {
      let headers;
      headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.delete(this.host + queryString, { headers: headers }).pipe().subscribe(res => {
        resolve(res.json());
      });
    });
  }

  private _Post(queryString, bodyRequest) {
    return new Promise((resolve, reject) => {
      let headers;
      headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.post(this.host + queryString, this.packParameter(bodyRequest), { headers: headers }).pipe().subscribe(res => {
        resolve(res.json());
      });
    });
  }

  private _Put(queryString, bodyRequest) {
    return new Promise((resolve, reject) => {
      let headers;
      headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.put(this.host + queryString, this.packParameter(bodyRequest), { headers: headers }).pipe().subscribe(res => {
        resolve(res.json());
      });
    });
  }

  private packParameter(param) {
    let _parameter;
    _parameter = Object.keys(param).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(param[key]);
    }).join('&');
    return _parameter;
  }
}
