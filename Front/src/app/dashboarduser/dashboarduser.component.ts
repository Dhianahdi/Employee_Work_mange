import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboarduser',

  templateUrl: './dashboarduser.component.html',
  styleUrl: './dashboarduser.component.css'
})
export class DashboarduserComponent  implements OnInit {
  departments: string[] = [];
  topAbsences: any[] = [];
  topTardiness: any[] = [];
  topPunctualEmployees: any[] = [];
  punctualityDetails: any[] = [];
  employees: any[] = [];
  view: [number, number] = [2000, 800];
  showLegend: boolean = true;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Employee';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Count';
  colorScheme: Color = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#9147FA', '#F667EA', '#4ACCFB', '#E83838']
  };
  columns = [
    { prop: 'name' },
    { prop: 'value' }
  ];
  filterType: string = 'month';
  selectedMonth: string = moment().format('MM-YYYY');
  selectedYear: number = moment().year();
  months = [
    { name: 'January', value: '01-' + moment().year() },
    { name: 'February', value: '02-' + moment().year() },
    { name: 'March', value: '03-' + moment().year() },
    { name: 'April', value: '04-' + moment().year() },
    { name: 'May', value: '05-' + moment().year() },
    { name: 'June', value: '06-' + moment().year() },
    { name: 'July', value: '07-' + moment().year() },
    { name: 'August', value: '08-' + moment().year() },
    { name: 'September', value: '09-' + moment().year() },
    { name: 'October', value: '10-' + moment().year() },
    { name: 'November', value: '11-' + moment().year() },
    { name: 'December', value: '12-' + moment().year() }
  ];
  years = Array.from({ length: 5 }, (_, i) => moment().year() - i);
  selectedDepartment: string = '';

  constructor(private http: HttpClient, private spinner: NgxSpinnerService,    private router: Router,
) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  async getEmployees() {
    try {
      this.spinner.show();
      const response = await this.http.get<any[]>('http://localhost:5000/api/employee/employees').toPromise();
      this.employees = response || [];
      this.departments = Array.from(new Set(this.employees.map(employee => employee.department)));
      this.processEmployeeData();
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      this.spinner.hide();
    }
  }

  onFilterTypeChange() {
    this.onFilterChange();
  }

  onFilterChange() {
    this.processEmployeeData();
  }


  processEmployeeData() {
    const currentMonth = this.selectedMonth;
    const currentYear = moment(this.selectedYear, 'YYYY').year();
    let filteredEmployees = [];
    for (let employee of this.employees) {
      if (this.selectedDepartment === '' || employee.department === this.selectedDepartment) {

        filteredEmployees.push(employee);
      }
    }

    const absenceData = filteredEmployees.map(employee => {
      const count = this.filterType === 'year'
        ? Object.keys(employee.nbrAbsentParMois)
          .filter(date => moment(date, 'MM-YYYY').year() === currentYear)
          .reduce((sum, date) => sum + employee.nbrAbsentParMois[date], 0)
        : employee.nbrAbsentParMois[currentMonth] || 0;
      return { name: employee.nom, value: count, photo: employee.image, matricule: employee.matricule };
    }).sort((a, b) => b.value - a.value).slice(0, 10);

    const tardinessData = filteredEmployees.map(employee => {
      const count = this.filterType === 'year'
        ? Object.keys(employee.retardParMois)
          .filter(date => moment(date, 'MM-YYYY').year() === currentYear)
          .reduce((sum, date) => sum + employee.retardParMois[date], 0)
        : employee.retardParMois[currentMonth] || 0;
      return { name: employee.nom, value: count, photo: employee.image, matricule: employee.matricule };
    }).sort((a, b) => b.value - a.value).slice(0, 10);

    const punctualityData = filteredEmployees.map(employee => {
      const count = this.filterType === 'year'
        ? Object.keys(employee.ponctualiteParMois)
          .filter(date => moment(date, 'MM-YYYY').year() === currentYear)
          .reduce((sum, date) => sum + employee.ponctualiteParMois[date], 0)
        : employee.ponctualiteParMois[currentMonth] || 0;

      return { name: employee.nom, value: count, photo: employee.image, matricule: employee.matricule };
    }).sort((a, b) => b.value - a.value).slice(0, 10);

    const punctualityData1 = filteredEmployees.map(employee => {
      const count = this.filterType === 'year'
        ? Object.keys(employee.ponctualiteParMois)
          .filter(date => moment(date, 'MM-YYYY').year() === currentYear)
          .reduce((sum, date) => sum + employee.ponctualiteParMois[date], 0)
        : employee.ponctualiteParMois[currentMonth] || 0;

      return { name: employee.nom, value: count, photo: employee.image, matricule: employee.matricule, DP: employee.DP };
    }).sort((a, b) => b.value - a.value);

    this.topAbsences = absenceData;
    this.topTardiness = tardinessData;
    this.topPunctualEmployees = punctualityData;
    this.punctualityDetails = punctualityData1;
  }

  onSelect(event: any): void {
    console.log(event);
  }
  navigateprofile(mat: string, DP: string) {
    localStorage.setItem('mat', mat);
    localStorage.setItem('dp', DP);
    this.router.navigate(['/profile']);
  }
}

