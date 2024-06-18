import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
   employees: any;
   employees1: any;
  filteredEmployees: any[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  async getEmployees() {
    try {
      const response = await this.http.get<any[]>('http://127.0.0.1:5000/api/employee/employees').toPromise();
      this.employees = response;
      this.employees1 = response;
      this.filteredEmployees = [...this.employees]; // Initialize filteredEmployees with all employees
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }

  ngOnInit() {
    this.getEmployees();
  }

  searchEmployees() {
      this.employees=this.employees1

  if (this.searchTerm.trim() !== '') {
    this.filteredEmployees = this.employees.filter((employee: any) =>
      employee.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      employee.matricule.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.employees=this.filteredEmployees
    console.log( this.filteredEmployees)
  } else {
    this.filteredEmployees = [...this.employees]; // Réinitialise avec tous les employés si le terme de recherche est vide
  }
}

  navigateprofile(mat: string) {
    localStorage.setItem('mat', mat)
          this.router.navigate(['/profile']);
    }
}
