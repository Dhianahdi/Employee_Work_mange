import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: any;
  employees1: any;
  employeedata2: any;
  filteredEmployees: any[] = [];
  searchTerm: string = '';
  userForm: FormGroup;
  authForm: FormGroup;
  updateForm: FormGroup;
  imageSrc: string | ArrayBuffer | null = null;
  selectedEmployee: any = null;
  selectedFile: File | null = null;
  dpOptions: { value: boolean, label: string }[] = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
    ,private spinner: NgxSpinnerService
  ) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      matricule: ['', Validators.required],
      image: [null],
      DP: [false, Validators.required]

    });
    this.authForm = this.fb.group({
      matricule: [{ value: '' }, Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    });

    this.updateForm = this.fb.group({
      nom: ['', Validators.required],
      tel: ['', Validators.required],
      image: [null],
            DP: [false, Validators.required]

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
 this.toastr.success('File uploaded successfully');
    } catch (error) {
           this.toastr.error('Failed to upload file');
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

  navigateprofile(mat: string,DP: string) {
    localStorage.setItem('mat', mat);
    localStorage.setItem('dp', DP);
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
fileContent: string = '';
jsonContent: any;



   readTextFile(file: File) {
    let fileReader: FileReader = new FileReader();
    fileReader.onloadend = () => {
      this.fileContent = fileReader.result as string;
      console.log('Contenu du fichier:', this.fileContent);

      try {
        // Supposons que le fichier soit au format CSV, convertissez-le en JSON
        this.jsonContent = this.convertCSVToJSON(this.fileContent);
        console.log('Contenu JSON:', this.jsonContent);
      } catch (e) {
        console.error('Erreur lors de la conversion en JSON:', e);
      }
    };
    fileReader.readAsText(file);
  }

  onFileChangejson(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.readTextFile(event.target.files[0]);
    }
  }

  convertCSVToJSON(csv: string): any[] {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    const result = [];
    const headers = lines[0].split('\t').map(header => header.trim());

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentLine = lines[i].split('\t');

      if (currentLine.length === headers.length) {
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentLine[j].trim();
        }
        result.push(obj);
      } else {
        console.warn(`La ligne ${i + 1} ne contient pas le même nombre de colonnes que la ligne d'en-tête.`);
      }
    }

    return result;
  }

  async onSubmitjson() {
      this.spinner.show();




this.getEmployeesdata()

  }





  async onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.userForm.get('nom')?.value);
    formData.append('matricule', this.userForm.get('matricule')?.value);
    formData.append('image', this.userForm.get('image')?.value);
console.log(this.userForm)
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
      image: employee.image,
      DP: employee.DP,
      tel: employee.tel,
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
   removeLeadingZeros(matricule:any) {
      let numberWithoutZeros = parseInt(matricule, 10);

      if (isNaN(numberWithoutZeros)) {
        return '0';
      }

      return numberWithoutZeros.toString();
   }
   getStatus(point: any): string {
         const dp=localStorage.getItem("dp")
    const firstPoint = moment(point.points[0], ' HH:mm');
    const lastPoint = moment(point.points[point.points.length - 1], 'HH:mm');
    const datePart = moment(point.date, 'YYYY-MM-DD').format('YYYY-MM-DD');

    if (dp === "false") {

      if (firstPoint.isBefore(moment('08:19', 'HH:mm')) && lastPoint.isAfter(moment('16:45', 'HH:mm'))&&point.points.length<=4) {
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

      if (firstPoint.isBefore(moment('07:14', 'HH:mm'))) {
        if (lastPoint.isAfter(moment('13:55', 'HH:mm'))&&point.points.length<=4) {
        return 'Ok';

        }
      } else {
          if (firstPoint.isBefore(moment('13:42', 'HH:mm'))) {
        if (lastPoint.isAfter(moment('20:25', 'HH:mm'))&&point.points.length<=4) {
        return 'Ok';

        }
      }
      }
      const hasAuthorization = this.employeedata2.some((authorization: any) =>
        moment( authorization.dateDebut , 'YYYY-MM-DD').format('YYYY-MM-DD') === datePart
      );
      if (hasAuthorization) {
        return 'With Authorization';
      }
    }
    return 'Not Ok';
  }
async exportToExcel(): Promise<void> {
  const employeeData = [];
               this.spinner.show();

  for (const employee of this.employees) {
    localStorage.setItem("dp",employee.DP)
    try {
       const response2 = await this.http.get<any>('http://127.0.0.1:5000/api/employeePoints/getEmployeePointsDetails/' + this.removeLeadingZeros(employee.matricule)).toPromise();
       const response3 = await this.http.get<any>('http://127.0.0.1:5000/api/authorization/' + employee.matricule).toPromise();
this.employeedata2=response3
      const absences = response2.absences;
      const pointes = response2.employeeDetails;
                    let pointsStr = '';
         let saturdayStr = '';
      let sandayStr = '';
      for (const pointe of pointes) {

         const dp=localStorage.getItem("dp")

if (dp === "false") {
  if (pointe.jour === "Saturday") {
     saturdayStr += pointe.date + " :    " + pointe.points[0]  +'::'+pointe.points[pointe.points.length - 1] + '          \n';
  } else if (pointe.jour === "Sunday") {

    sandayStr+=  pointe.date + " :    " + pointe.points[0]  +'::'+pointe.points[pointe.points.length - 1] + '          \n';
   }

      }

        if ((this.getStatus(pointe) != 'Ok') ) {

          pointsStr +=pointe.date + " : " + pointe.points[0]  +'::'+pointe.points[pointe.points.length - 1]  + " : " +  " => " + (this.getStatus(pointe)) + '          \n'

 }

      }


      let absencesStr = '';

      if (absences && absences.length > 0) {
        absencesStr = absences.map((absence: any) => absence).join('         \n');
      }

      // for (const absence of absences) {
        employeeData.push({
          Matricule: employee.matricule,
          Nom: employee.nom,
           Absence: absencesStr,
         Retard: pointsStr,
         Samedi: saturdayStr,
         Dimanche: sandayStr,
        });
    //  }

      // for (const delay of delays) {
      //   employeeData.push({
      //     Nom: employee.nom,
      //     Matricule: employee.matricule,
      //     Date: delay.date,
      //     Type: 'Delay',
      //     Authorization: response3.some((auth: any) => auth.dateDebut === delay.date) ? 'With Authorization' : 'Without Authorization'
      //   });
      // }
    } catch (error: any) {
      if (error.status === 404) {
        console.log(`Employee with matricule ${employee.matricule} not found, skipping...`);
      } else {
        console.error(`Error processing employee with matricule ${employee.matricule}:`, error);
      }
    }
  }

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(employeeData);
  const workbook: XLSX.WorkBook = { Sheets: { 'Employee Data': worksheet }, SheetNames: ['Employee Data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, 'EmployeeData');
        this.spinner.hide();

}

// Example function to calculate absences
getAbsences(details: any): any[] {
  const absences = [];
  for (const date in details) {
    if (details[date].erreur === 'oui') {
      absences.push({ date });
    }
  }
  return absences;
}

// Example function to calculate delays
getDelays(details: any): any[] {
  const delays = [];
  for (const date in details) {
    if (details[date].points.length > 0) {
      const firstPoint = moment(details[date].points[0], 'HH:mm');
      const lastPoint = moment(details[date].points[details[date].points.length - 1], 'HH:mm');
      if (firstPoint.isAfter(moment('08:30', 'HH:mm')) || lastPoint.isBefore(moment('16:45', 'HH:mm'))) {
        delays.push({ date });
      }
    }
  }
  return delays;
}



  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
    console.log("done")
  }

  handleFile(event: any): void {
                 this.spinner.show();

  const file = event.target.files[0];
    if (!file) {
                     this.spinner.hide();

    return;
  }

  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    let worksheet = workbook.Sheets[sheetName];

    let sheetData:any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    sheetData[0][0] = 'Matricule';
    sheetData[0][1] = 'DateHeure';

    for (let i = 1; i < sheetData.length; i++) {
      const cellValue = sheetData[i][1];
      console.log(cellValue);
      if (typeof cellValue === 'number') {
        const date = this.convertExcelDateToJSDate(cellValue);
        const formattedDate = this.formatDate(date);
              console.log(formattedDate);

        sheetData[i][1] = formattedDate;
      }
    }

    worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, worksheet, sheetName);
    const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });

    const jsonData = this.convertExcelToJson(newWorkbook);

    console.log('JSON data:', jsonData);
    this.saveJsonDataToServer(jsonData)
                         this.spinner.hide();

  };
  reader.readAsArrayBuffer(file);
}

  private convertExcelToJson(workbook: XLSX.WorkBook): any[] {
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });
  console.log( sheetData )

  const jsonData = sheetData.slice(1).map((row: any) => ({
    Matricule: row.A,
    DateHeure: row.B
  }));

  return jsonData;
}

private convertExcelDateToJSDate(excelDate: number): Date {
  const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
  return date;
}

private formatDate(date: Date): string {
  const formattedDate = `${this.padNumber(date.getDate())}/${this.padNumber(date.getMonth() + 1)}/${date.getFullYear()} ${this.padNumber(date.getHours()-1)}:${this.padNumber(date.getMinutes())}`;
  return formattedDate;
}

private padNumber(num: number): string {
  return num.toString().padStart(2, '0');
}

private saveJsonDataToServer(jsonData: any): Promise<any> {
    const url = 'http://localhost:5000/api/saveJsonData';

    return this.http.post<any>(url, jsonData).toPromise();
  }
}
