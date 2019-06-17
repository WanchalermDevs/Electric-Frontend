import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class DormitoryLiveService {
  host: string;

  constructor(private _http: Http) {
    this.host = 'http://localhost:3000/dormitory-live';
  }

  recordStudentDorminitory(param) {
    return this._Post('/', param);
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

  private packParameter(param) {
    let _parameter;
    _parameter = Object.keys(param).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(param[key]);
    }).join('&');
    return _parameter;
  }
}
