import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ElectricalMeterService {

  host: string;

  constructor(private _http: Http) {
    this.host = 'http://localhost:3000/electrical-meter';
  }

  createNewElectricalMeter(code, text, note) {
    const data = {
      token: window.localStorage.getItem('token'),
      code: code,
      text: text,
      note: note
    };
    return this._Post('', data);
  }

  editAnElectricalMeter(code, text, note, id) {
    const data = {
      token: window.localStorage.getItem('token'),
      id: id,
      code: code,
      text: text,
      note: note
    };
    return this._Put('', data);
  }

  getElecticalMeterList() {
    return this._Get('/' + window.localStorage.getItem('token'));
  }

  getAnElectricalMeter(id) {
    return this._Get('/' + window.localStorage.getItem('token') + '/' + id);
  }

  removeElectricalMeter(id) {
    return this._Delete('/' + window.localStorage.getItem('token') + '/' + id);
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
