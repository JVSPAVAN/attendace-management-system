import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, retry, throwError, BehaviorSubject } from 'rxjs';
import { Student } from '../models/student';
import { User } from '../models/user';
import { Attendance } from '../models/attendance';

@Injectable({
  providedIn: 'root',
})
export class HttpDataService {
  base_url = 'http://localhost:3000/students';
  login_url = 'http://localhost:3000/login';
  attendance_url = 'http://localhost:3000/attendance';

  
  private loginReset: BehaviorSubject<any> = new BehaviorSubject(false);

  constructor(private _http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occureed: ', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Somthing bad happend; please try again later.');
  }

  //create item
  createItem(item: any): Observable<Student> {
    return this._http
      .post<Student>(this.base_url, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  //get all students data
  getList(): Observable<Student> {
    return this._http
      .get<Student>(this.base_url)
      .pipe(retry(2), catchError(this.handleError));
  }

  //get student data by Id
  getItem(id: string): Observable<Student> {
    return this._http
      .get<Student>(this.base_url + '/' + id)
      .pipe(retry(2), catchError(this.handleError));
  }

  //update student data ny id
  updateItem(id: string, item: any): Observable<Student> {
    return this._http
      .put<Student>(this.base_url + '/' + id, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  //delete student data ny id
  deleteItem(id: string) {
    return this._http
      .delete<Student>(this.base_url + '/' + id, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  //login data
  login(): Observable<User> {
    return this._http
      .get<User>(this.login_url)
      .pipe(retry(2), catchError(this.handleError));
  }

  setLoginReset(state: any): void {
    this.loginReset.next(state);
  }
  getLoginReset(): Observable<any> {
    return this.loginReset.asObservable();
  }

  //Attendance data
  getAttn(): Observable<Attendance> {
    return this._http
      .get<Attendance>(this.attendance_url)
      .pipe(retry(2), catchError(this.handleError));
  }

   //update student attendance
   updateAttn(item: any): Observable<Attendance> {
    return this._http
      .put<Attendance>(this.attendance_url + '/' + item.id, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  //add student attendance
  createAttn(item: any): Observable<Attendance> {
    return this._http
      .post<Attendance>(this.attendance_url, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
