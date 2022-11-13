import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from '../models/student';
import { HttpDataService } from '../services/http-data.service';
import * as _ from 'lodash';
import { Attendance } from '../models/attendance';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  @ViewChild('studentForm', { static: false })
  studentForm!: NgForm;

  displayedColumns: string[] = [
    'id',
    'name',
    'age',
    'mobile',
    'email',
    'address',
    'actions',
    'attendance',
  ];
  dataSource = new MatTableDataSource([]);

  studentData!: Student;
  isEditMode = false;
  selectedRow: any;
  isAdmin = false;
  attendanceData: Attendance[] = [];
  date: any;
  selectedDate: any;
  attnStudent: any;

  constructor(
    private httpDataSerice: HttpDataService,
    private _snackBar: MatSnackBar
  ) {
    this.studentData = {} as Student;

    this.httpDataSerice.getAttn().subscribe((response: any) => {
      this.attendanceData = response;
    });
  }

  ngOnInit(): void {
    this.isAdmin = sessionStorage.getItem('isAdmin') == 'false' ? false : true;
    console.log('admin ', this.isAdmin);
    this.selectedRow = null;
    this.getAllStudents();
  }

  getAllStudents() {
    this.httpDataSerice.getList().subscribe((response: any) => {
      this.dataSource.data = response;
      if (!this.isAdmin) {
        this.selectedRow = this.dataSource.data.filter(
          (element: any) => element.email == sessionStorage.getItem('user')
        )?.[0];
        this.getAttendance();
        console.log('data ', this.selectedRow);
        console.log('user ', sessionStorage.getItem('user'));
      } else {
        if(!this.selectedDate){
          this.date = new Date();
        }
      }

    });
  }

  editItem(element: any) {
    this.studentData = _.cloneDeep(element);
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.studentForm.resetForm();
  }

  onSubmit(form: NgForm) {
    let formData = new Student();
    formData = form.value;
    formData = { ...formData, id: this.dataSource.data.length + 1 };
    this.httpDataSerice.createItem(formData).subscribe((response: any) => {
      // this.httpDataSerice.getList().subscribe((response: any) => {
      //   response.push(formData)
      //   this.dataSource.data = response;
      // });
      this.cancelEdit();
      this.getAllStudents();
    });
  }

  updateItem(id: any, form: NgForm) {
    let formData = new Student();
    formData = form.value;
    formData = { ...formData, id: this.studentData.id };

    this.httpDataSerice
      .updateItem(this.studentData.id, formData)
      .subscribe((response: any) => {
        // this.dataSource.data = this.dataSource.data.filter((element: any) => {
        //   return element.id === this.studentData.id ? formData : element;
        // })
        this.cancelEdit();
        this.getAllStudents();
        if (this.selectedRow && this.selectedRow.id === this.studentData.id) {
          this.showStudentData(formData);
        }
      });
  }

  deleteItem(id: any) {
    this.httpDataSerice.deleteItem(id).subscribe((response: any) => {
      this.dataSource.data = this.dataSource.data.filter((element: any) => {
        return element.id !== id ? element : false;
      });
      if (this.selectedRow && this.selectedRow.id === id) {
        this.close();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showStudentData(studentData: any) {
    this.selectedRow = studentData;
  }

  close() {
    this.selectedRow = null;
  }

  attn(id: any) {
    if (this.date) {
      let event = new Date(this.date);

      let date = JSON.stringify(event);
      this.selectedDate = date.slice(1, 11);
      let attn = this.attendanceData.filter(
        (element: any) => element.date == this.selectedDate
      )?.[0];
      const present = attn?.present || [];
      const absent = attn?.absent || [];
      if (present && present.includes(id)) {
        return 'Present';
      } else if (absent && absent.includes(id)) {
        return 'Absent';
      }else{
        return 'Absent';
      }
    }
    return 'Absent';
  }

  editAttn(id: any) {
    if (this.date) {
      let event = new Date(this.date);
      let date = JSON.stringify(event);
      this.selectedDate = date.slice(1, 11);
      let attn = this.attendanceData.filter((element: any) => element.date == this.selectedDate)?.[0];
      let present = attn?.present || [];
      let absent = attn?.absent || [];
      if (present?.includes(id)) {
        present = present.filter((obj: any) => {
          return obj !== id;
        });
        absent.push(id);
      } else if (absent?.includes(id)) {
        absent = absent.filter((obj: any) => {
          return obj !== id;
        });
        present.push(id);
      } else {
        present.push(id);
      }
      attn = { id: attn?.id, date: this.selectedDate, present: present || [], absent: absent || [] };

      if(attn.id){
      this.httpDataSerice
        .updateAttn(attn)
        .subscribe((response: any) => {
          this.cancelEdit();
          this.getAllStudents();
        });}else{
          const newAttn = { id: this.attendanceData.length + 1, date: this.selectedDate, present: present || [], absent: absent || [] };
        this.httpDataSerice
        .createAttn(newAttn)
        .subscribe((response: any) => {
          this.cancelEdit();
          this.getAllStudents();
        });}
    } else {
      this._snackBar.open('Please select Date', 'Ok!!!', {
        duration: 3000,
      });
    }
  }

  getAttendance(){
    this.attnStudent = [];
    this.attendanceData.forEach((element: any) => {
      if(element.present.includes(this.selectedRow.id)){
        this.attnStudent.push({"date":element.date, "attendance": "Present"});
      }else{
        this.attnStudent.push({"date":element.date, "attendance": "Absent"});
      }
    });
  }
}
