import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class HabitatService {

  host: string;

  constructor(private _http: Http) {
    this.host = 'http://localhost:3000/habitat';
  }

  getAllStores() {
    return this.habitatGet('/stores/' + window.localStorage.getItem('token'));
  }

  getAllRoom() {
    return this.habitatGet('/room/' + window.localStorage.getItem('token'));
  }

  getRoomOrStoreInfoByMeterId(id) {
    return this.habitatGet('/roomByMeterId/' + window.localStorage.getItem('token') + '/' + id);
  }

  createRoom(parentId, code, name, type, meterID) {
    const body = {
      token: window.localStorage.getItem('token'),
      parent_id: parentId,
      code: code,
      name: name,
      type: type,
      meterID: meterID
    };
    return this.habitatPost('/room', body);
  }

  removeRoom(room_id) {
    return this.habitatDelete('/room/' + window.localStorage.getItem('token') + '/' + room_id);
  }

  createBuilding(buildingCode, buildingName) {
    const body = {
      token: window.localStorage.getItem('token'),
      code: buildingCode,
      name: buildingName
    };
    return this.habitatPost('/building', body);
  }

  getAllBuilding() {
    return this.habitatGet('/building/' + window.localStorage.getItem('token'));
  }

  deleteABuilding(buildingID) {
    return this.habitatDelete('/building/' + window.localStorage.getItem('token') + '/' + buildingID);
  }

  private habitatDelete(queryString) {
    return new Promise((resolve, reject) => {
      let headers;
      headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.delete(this.host + queryString, { headers: headers }).pipe().subscribe(res => {
        resolve(res.json());
      });
    });
  }

  private habitatGet(queryString) {
    return new Promise((resolve, reject) => {
      let headers;
      headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.get(this.host + queryString, { headers: headers }).pipe().subscribe(res => {
        resolve(res.json());
      });
    });
  }

  private habitatPost(queryString, bodyRequest) {
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
