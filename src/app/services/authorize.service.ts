import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

  private _host;

  constructor(private _http: Http) {
    this._host = 'http://localhost:3000/authen';
  }

  private packParameter(param) {
    let _parameter;
    _parameter = Object.keys(param).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(param[key]);
    }).join('&');
    return _parameter;
  }

  authentication(user, pass) {
    const param = {
      username: user,
      password: pass
    };
    return new Promise((resolve, reject) => {
      let headers;
      headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      // tslint:disable-next-line:max-line-length
      return this._http.post(this._host + '/login', this.packParameter(param), { headers: headers }).pipe().subscribe(res => {
        resolve(res.json());
      });

    });
  }

  checkLogin(user) {
    const param = {
      username: user
    };
    return new Promise((resolve, reject) => {
      let headers;
      headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      // tslint:disable-next-line:max-line-length
      return this._http.post(this._host + '/auth', this.packParameter(param), { headers: headers }).pipe().subscribe(res => {
        resolve(res.json());
      });

    });
  }
}
