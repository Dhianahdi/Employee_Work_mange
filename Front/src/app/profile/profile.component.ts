import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
   employee: any;
   employeedata: any;
matricule:any
  constructor(private http: HttpClient, private router: Router) { }
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
this.matricule=localStorage.getItem('mat')
      const response = await this.http.get<any[]>('http://127.0.0.1:5000/api/employee/getEmployeeByMatricule/'+this.matricule).toPromise();
      const response1 = await this.http.get<any[]>('http://127.0.0.1:5000/api/employeePoints/'+this.removeLeadingZeros(this.matricule)).toPromise();
      this.employee = response;
     this.employeedata = response1;
     console.log( this.employeedata )

    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }

  ngOnInit() {
    this.getEmployees();
  }
hoursToDays(hoursMinutes:any) {
  // Split the input into hours and minutes
  const [hours, minutes] = hoursMinutes.split(':').map(Number);

  // Convert hours and minutes to total minutes
  const totalMinutes = (hours * 60) + minutes;

  // Convert total minutes to days and remaining minutes
  const days = Math.floor(totalMinutes / (24 * 60));
  const remainingMinutes = totalMinutes % (24 * 60);
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMinutesInHour = remainingMinutes % 60;

  return `${days} days, ${remainingHours} hours, and ${remainingMinutesInHour} minutes`;
}

}
