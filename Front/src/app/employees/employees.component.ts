import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

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
  userForm: FormGroup;
  authForm: FormGroup;
  updateForm: FormGroup;
  imageSrc: string | ArrayBuffer | null = null;
  selectedEmployee: any = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
    ,private spinner: NgxSpinnerService
  ) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      image: [null]
    });
    this.authForm = this.fb.group({
      matricule: [{ value: '' }, Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    });

    this.updateForm = this.fb.group({
      nom: ['', Validators.required],
      image: [null]
    });
  }

  async getEmployees() {
    try {
               this.spinner.show();

      const response = await this.http.get<any[]>('http://127.0.0.1:5000/api/employee/employees').toPromise();
      this.employees = response;
      this.employees1 = response;
      this.filteredEmployees = [...this.employees];
    } catch (error) {
      console.error('Error fetching employees:', error);
    }finally {
      this.spinner.hide();
    }
  }


    async getEmployeesdata() {
    try {

   const response1 = await this.http.get<any[]>('http://localhost:5000/api/employee/group-points-by-employee').toPromise();

    } catch (error) {
      console.error('Error fetching employees:', error);
    }finally {
      this.spinner.hide();
    }
  }

  ngOnInit() {

    this.getEmployees();

  }

  searchEmployees() {
                   this.spinner.show();

    this.employees = this.employees1;

    if (this.searchTerm.trim() !== '') {
      this.filteredEmployees = this.employees.filter((employee: any) =>
        employee.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.matricule.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.employees = this.filteredEmployees;          this.spinner.hide();

    } else {
      this.filteredEmployees = [...this.employees]; // Réinitialise avec tous les employés si le terme de recherche est vide
          this.spinner.hide();
}
  }

  navigateprofile(mat: string) {
    localStorage.setItem('mat', mat);
    this.router.navigate(['/profile']);
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      const formData = new FormData();
      formData.append('file', file);

      this.http.post<any>('http://127.0.0.1:5000/api/upload', formData).subscribe(
        (response) => {
          this.userForm.patchValue({
            image: response.filename
          });
          this.updateForm.patchValue({
            image: response.filename
          });

          reader.readAsDataURL(file);
          reader.onload = () => {
            this.imageSrc = reader.result;
          };
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    }
  }

    onFileChangejson(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }
  async onSubmitjson() {
    if (!this.selectedFile) {
      this.toastr.error('Please select a file to upload');
      return;
    }
               this.spinner.show();

    const formData = new FormData();
    formData.append('file', this.selectedFile);

  await  this.http.post('http://localhost:5000/api/upload-file', formData).subscribe(
       (response) => {
      if (response) {
this.getEmployeesdata()
        this.toastr.success('File uploaded successfully');
}

      },
      (error) => {

              this.spinner.hide();
        console.error('Error uploading file:', error);

        this.toastr.error('Failed to upload file');
      }
    );
  }
  async onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.userForm.get('nom')?.value);
    formData.append('image', this.userForm.get('image')?.value);

    try {
      const response = await this.http.post('http://127.0.0.1:5000/api/employee', this.userForm.value).toPromise();
      this.toastr.success('Employee created successfully');
      window.location.reload(); // Rafraîchit la page
    } catch (error) {
      console.error('Error creating user:', error);
      this.toastr.error('Error creating user');
    }
  }

  openUpdateModal(employee: any) {
    this.selectedEmployee = employee;
    this.updateForm.patchValue({
      matricule: employee.matricule,
      nom: employee.nom,
      image: employee.image
    });
    this.authForm.patchValue({
      matricule: employee.matricule,

    });
    console.log(employee.matricule);

    this.imageSrc = `http://127.0.0.1:5000/img/${employee.image}`;
  }

  async onUpdate() {
    if (this.updateForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.updateForm.get('nom')?.value);
    formData.append('image', this.updateForm.get('image')?.value);

    try {
      const response = await this.http.put(`http://127.0.0.1:5000/api/employee/${this.selectedEmployee.matricule}`, this.updateForm.value).toPromise();
      this.toastr.success('Employee updated successfully');
      window.location.reload(); // Rafraîchit la page
    } catch (error) {
      console.error('Error updating user:', error);
      this.toastr.error('Error updating user');
    }
  }

  async removeEmployee() {
    try {
      await this.http.delete(`http://127.0.0.1:5000/api/employee/${this.selectedEmployee.matricule}`).toPromise();
      this.toastr.success('Employee removed successfully');
      window.location.reload(); // Rafraîchit la page
    } catch (error) {
      console.error('Error removing user:', error);
      this.toastr.error('Error removing user');
    }
  }

  onSubmit1(): void {
    if (this.authForm.invalid) {
      return;
    }
    const dateDebut = new Date(this.authForm.get('dateDebut')?.value);
    const dateFin = new Date(this.authForm.get('dateFin')?.value);

    if (dateDebut >= dateFin) {
      this.toastr.error('La date de début doit être antérieure à la date de fin.');
      return;
    }
    // Envoyer la requête HTTP pour ajouter l'autorisation
    this.http.post<any>('http://127.0.0.1:5000/api/authorization', this.authForm.value)
      .subscribe(
        (response) => {
          console.log(response);
          this.toastr.success('Authorization added successfully');
          this.userForm.reset(); // Réinitialiser le formulaire après succès

        },
        (error) => {
          console.error('Error adding authorization:', error);
          this.toastr.error('Failed to add authorization');
        }
      );
  }

  showPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.display = 'block';
    }
  }

  hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.display = 'none';
    }
  }
}
