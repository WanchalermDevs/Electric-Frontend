import { Injectable } from '@angular/core';
import { Http, ResponseContentType } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class PDFGenteratorService {
  host: any;
  constructor(private http: Http) {
    this.host = 'http://localhost:3005';
  }

  downloadReport(file) {
    const body = { filename: file };
    let headers;
    headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.host, body, { headers: headers, responseType: ResponseContentType.Blob });
    // return this.http.post(this.host, body, { headers: headers });
  }

  downloadExcel(period_id, meter_id) {
    const body = {
      token: window.localStorage.getItem('token'),
      period_id: period_id,
      meter_id: meter_id
    } ;
    let headers;
    headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return this.http.post('http://localhost:3000/download/sum-meter', body, { headers: headers, responseType: ResponseContentType.Blob });
  }
}
