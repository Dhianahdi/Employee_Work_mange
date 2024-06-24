import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
      // Convert the matricule to a number, which will remove leading zeros
      let numberWithoutZeros = parseInt(matricule, 10);

      // If the input was "000", the result should be "0" instead of an empty string or NaN
      if (isNaN(numberWithoutZeros)) {
        return '0';
      }

      return numberWithoutZeros.toString();
      }

      
 async getEmployees() {
   try {
         this.spinner.show();

this.matricule=localStorage.getItem('mat')
      const response = await this.http.get<any[]>('http://127.0.0.1:5000/api/employee/getEmployeeByMatricule/'+this.matricule).toPromise();
    const response1 = await this.http.get<EmployeePoint[]>('http://127.0.0.1:5000/api/employeePoints/' + this.removeLeadingZeros(this.matricule)).toPromise();
    const response2 = await this.http.get<any>('http://127.0.0.1:5000/api/employeePoints/getEmployeePointsDetails/' + this.removeLeadingZeros(this.matricule)).toPromise();
    const response3 = await this.http.get<any>('http://127.0.0.1:5000/api/authorization/' + (this.matricule)).toPromise();
      this.employee = response;
     this.employeedata = response1 ;
     this.employeedata1 = response2 ;
     this.employeedata2 = response3;
     this.data=this.calculateTotalAuthorizationTime(this.employeedata2)
console.log( response3)

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

  const days = Math.floor(totalMinutes / (24 * 60));
  const remainingMinutes = totalMinutes % (24 * 60);
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
      // Obtenez la date et le nom du jour à partir de la propriété "jour"
      const dateStr = employee.jour;
      const dayOfWeek = this.getDayOfWeek(dateStr);

      // Obtenez la liste des points de l'employé
      const points = employee.points;

      // Ajoutez ces informations à votre structure de données de sortie
      this.processedData.push({ date: `${dayOfWeek}, ${dateStr}`, points: points });
    });
console.log(this.processedData)
  }

  getDayOfWeek(dateStr: string): string {
    // Convertissez la chaîne de date en un objet Date JavaScript
    const date = new Date(dateStr);

    // Obtenez le nom du jour de la semaine (en anglais, vous pouvez le traduire si nécessaire)
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
    const thresholdTime = moment('08:15', 'HH:mm');
    const pointTime = moment(time, 'HH:mm');
    return pointTime.isAfter(thresholdTime);
  }
}
