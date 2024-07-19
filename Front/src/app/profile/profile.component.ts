import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

interface ProcessedData {
  date: string; // Date avec nom de jour
  points: string[]; // Liste des points
}
interface EmployeePoint {
  details: {
    points: string[];
    jour: string;
    erreur: string;
    heuresTravail: string;
    heuresNormales: string;
    heuresSupplementaires: string;
  };
  totalHeuresNormales: string;
  totalHeuresSupplementaires: string;
  totalHeuresSamedi: string;
  totalHeuresDimanche: string;
  absences: string[];
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
data:any
   employee: any;
  employeedata: any
  employeedata1: any
  processedData: any
  employeedata2: any
  matricule: any
  constructor(private http: HttpClient, private router: Router,private spinner: NgxSpinnerService) { }
      removeLeadingZeros(matricule:any) {
      let numberWithoutZeros = parseInt(matricule, 10);

      if (isNaN(numberWithoutZeros)) {
        return '0';
      }

      return numberWithoutZeros.toString();
      }

filterDates(data: any[]): any[] {
  const today = moment();
  const lastMonth26 = moment().subtract(1, 'month').date(26);
  const lastMonth26Str = lastMonth26.format('MM/DD/YYYY ');
    const itemDate26 = moment(lastMonth26Str, 'MM/DD/YYYY');

  return data.filter(item => {
        let itemDate = moment(item.DateHeure).format('MM/DD/YYYY');

    const itemDate2 = moment(itemDate, 'MM/DD/YYYY');

    return itemDate2.isAfter(itemDate26);
  });
}


 async getEmployees() {
   try {
         this.spinner.show();

     this.matricule = localStorage.getItem('mat')
         console.log(   this.matricule)

      const response = await this.http.get<any[]>('https://192.168.3.2:5000/api/employee/getEmployeeByMatricule/'+this.matricule).toPromise();
    const response1 = await this.http.get<EmployeePoint[]>('https://192.168.3.2:5000/api/employeePoints/' + this.removeLeadingZeros(this.matricule)).toPromise();
    const response2 = await this.http.get<any>('https://192.168.3.2:5000/api/employeePoints/getEmployeePointsDetails/' + this.removeLeadingZeros(this.matricule)).toPromise();
    const response3 = await this.http.get<any>('https://192.168.3.2:5000/api/authorization/' +this.removeLeadingZeros (this.matricule)).toPromise();
      this.employee = response;
     this.employeedata = response1 ;
     this.employeedata1 = response2;
     for (let i = 0; i < response2.absences.length; i++) {
  this.setCongeStatus(response2.absences[i]) ;
}
     this.employeedata2 = this.filterDates(response3);
     this.data=this.calculateTotalAuthorizationTime(this.employeedata2)

    } catch (error) {
      console.error('Error fetching employees:', error);
    }finally {
      this.spinner.hide();
    }
  }

  ngOnInit() {
    this.getEmployees();
  }
hoursToDays(hoursMinutes:any) {
  const [hours, minutes] = hoursMinutes.split(':').map(Number);

  const totalMinutes = (hours * 60) + minutes;

  const days = Math.floor(totalMinutes / (8 * 60));
  const remainingMinutes = totalMinutes % (8 * 60);
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMinutesInHour = remainingMinutes % 60;

  return `${days} days, ${remainingHours} hours, and ${remainingMinutesInHour} minutes`;
}
 processEmployeeData(employees: any) {
 if (!employees) {
    console.error('No employee data received');
 }
   console.log(employees)
    employees.forEach((employee:any) => {
      const dateStr = employee.jour;
      const dayOfWeek = this.getDayOfWeek(dateStr);

      const points = employee.points;

      this.processedData.push({ date: `${dayOfWeek}, ${dateStr}`, points: points });
    });
console.log(this.processedData)
  }

  getDayOfWeek(dateStr: string): string {
    const date = new Date(dateStr);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[date.getDay()];

    return dayOfWeek;
  }
    displayPoint(point: string | undefined): string {
    return point || '-';
    }

 calculateDuration(startDate: Date, endDate: Date): { days: number, hours: number, minutes: number } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
 }
  calculateTotalAuthorizationTime(authorizations: any[]): string {
  let totalDays = 0;
  let totalHours = 0;
  let totalMinutes = 0;

  authorizations.forEach(auth => {
    const duration = this.calculateDuration(auth.dateDebut, auth.dateFin);
    totalDays += duration.days;
    totalHours += duration.hours;
    totalMinutes += duration.minutes;
  });

  // Convert total minutes to hours and days if necessary
  totalHours += Math.floor(totalMinutes / 60);
  totalMinutes = totalMinutes % 60;

  totalDays += Math.floor(totalHours / 24);
  totalHours = totalHours % 24;

  return `${totalDays} days, ${totalHours} hours, and ${totalMinutes} minutes`;
}


  isExceedingTime(time: string): boolean {
    const dp=localStorage.getItem("dp")
    const thresholdTime = moment('08:15', 'HH:mm');
    const thresholdTime0 = moment('16:55', 'HH:mm');
    const thresholdTime1 = moment('13:42', 'HH:mm');
    const thresholdTime2 = moment('17:15', 'HH:mm');
    const thresholdTime3 = moment('07:12', 'HH:mm');
    const thresholdTime4 = moment('12:45', 'HH:mm');
    const pointTime = moment(time, 'HH:mm');
    if (dp === "false") {
          return pointTime.isBetween(thresholdTime,thresholdTime0);

    } else {

                return (pointTime.isBetween(thresholdTime1,thresholdTime2)||pointTime.isBetween(thresholdTime3,thresholdTime4));

    }
  }


  getStatus(point: any): string {
    const dp = localStorage.getItem("dp")

    const WH=moment(point.heuresNormales, 'HH:mm')
    const firstPoint = moment(point.points[0], ' HH:mm');
    const lastPoint = moment(point.points[point.points.length - 1], 'HH:mm');
    const datePart = moment(point.date, 'YYYY-MM-DD').format('YYYY-MM-DD');


    if (dp === "false") {


      if (firstPoint.isBefore(moment('08:19', 'HH:mm')) && lastPoint.isAfter(moment('16:45', 'HH:mm'))&& WH.isAfter(moment('7:45', 'HH:mm'))&&point.points.length<=4) {
        return 'Ok';
      }
      const hasAuthorization = this.employeedata2.some((authorization: any) =>
        moment( authorization.dateDebut , 'YYYY-MM-DD').format('YYYY-MM-DD') === datePart
      );
      if (hasAuthorization) {
        return 'With Authorization';
      }
    }
    if (dp === "true") {

      if (firstPoint.isBefore(moment('07:14', 'HH:mm'))&& WH.isAfter(moment('6:45', 'HH:mm'))) {
        if (lastPoint.isAfter(moment('13:55', 'HH:mm'))&&point.points.length<=4) {
        return 'Ok';

        }
      } else if (firstPoint.isBefore(moment('13:42', 'HH:mm'))&&WH.isAfter(moment('6:45', 'HH:mm'))) {

        if (lastPoint.isAfter(moment('20:25', 'HH:mm'))&&point.points.length<=4) {
        return 'Ok';

        }

      }
      const hasAuthorization = this.employeedata2.some((authorization: any) =>
        moment( authorization.dateDebut , 'YYYY-MM-DD').format('YYYY-MM-DD') === datePart
      );
      console.log()
      if (hasAuthorization) {
        return 'With Authorization';
      }
    }
    return 'Not Ok';
  }
  congeStatus: { [key: string]: string } = {};


    getCongesByMatriculeAndDate(matricule: string, date: string): Observable<any> {
    const params = new HttpParams()
      .set('matricule', matricule)
      .set('date', date);
            console.log(params);

      const response = this.http.get<any>('https://192.168.3.2:5000/api/conge/search/'+matricule+"/"+date);
      console.log(response);
    return response;
    }
  congeDetails: any;

  async setCongeStatus(date: any) {

    this.congeStatus[date] = await this.checkCongeStatus(date);
  }

  async checkCongeStatus(date: any): Promise<string> {
    try {
      console.log(this.employee.matricule)
      const response = await this.getCongesByMatriculeAndDate(this.employee.matricule, date).toPromise();
            console.log(response)

      return response.enConge ? 'DayOff' : 'Unjustified';
    } catch (error) {
      console.error('Error checking conge status:', error);
      return 'Erreur lors de la vérification du congé';
    }
  }


}
