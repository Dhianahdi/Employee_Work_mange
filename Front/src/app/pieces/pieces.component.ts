import { HttpClient } from '@angular/common/http';
import {Component, OnInit } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

@Component({
  selector: 'app-pieces',

  templateUrl: './pieces.component.html',
  styleUrls: ['./pieces.component.css'],

})
export class PiecesComponent implements OnInit {
  filterType: string = 'day';
  selectedDay: string = moment().format('YYYY-MM-DD');
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
  columnsToDisplay = ['Machine', ...this.months.map(month => month.name)];
filteredData:any
machineCount:any
machineCounttable:any
  quantiteParNom: any;
  countParEtatPiece: any;
  countParStatut: any;
  nonConformePerMonth: any;
  transformedNonConformeTableData: any;
  view: [number, number] = [700, 400];
  showLegend: boolean = true;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Count';
  colorScheme: Color = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#9147FA', '#F667EA', '#4ACCFB', '#E83838', '#6CBA13', '#FFCC00', '#162DF5', '#38E85E']
  };
  colorScheme2: Color = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#9147FA', '#4ACCFB', '#4ACCFB', '#E83838']
  };
  legendPosition: LegendPosition = LegendPosition.Right;













  view1: any[] = [700, 370];

  // options
  legendTitle: string = 'Products';
  legendTitleMulti: string = 'Months';
  legendPosition1: string = 'below'; // ['right', 'below']
  legend: boolean = true;

  xAxis: boolean = true;
  yAxis: boolean = true;

  yAxisLabel1: string = 'Sales';
  xAxisLabel1: string = 'Products';
  showXAxisLabel1: boolean = true;
  showYAxisLabel1: boolean = true;

  maxXAxisTickLength: number = 30;
  maxYAxisTickLength: number = 30;
  trimXAxisTicks: boolean = false;
  trimYAxisTicks: boolean = false;
  rotateXAxisTicks: boolean = false;

  xAxisTicks: any[] = ['Genre 1', 'Genre 2', 'Genre 3', 'Genre 4', 'Genre 5', 'Genre 6', 'Genre 7']
  yAxisTicks: any[] = [100, 1000, 2000, 5000, 7000, 10000]

  animations: boolean = true; // animations on load

  showGridLines: boolean = true; // grid lines

  showDataLabel: boolean = true; // numbers on bars



  schemeType: any = 'ordinal'; // 'ordinal' or 'linear'

  activeEntries: any[] = ['book']
  barPadding: number = 5
  tooltipDisabled: boolean = false;

  yScaleMax: number = 9000;

  roundEdges: boolean = false;

















  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getDataForLast24Hours();
  }

  async getDataForLast24Hours() {
    const startDate = moment(this.selectedDay).startOf('day').format('YYYY-MM-DD');
    const endDate = moment(this.selectedDay).endOf('day').format('YYYY-MM-DD');
    try {
      this.spinner.show();
      const response = await this.http.post<any>('https://192.168.3.2:5000/api/fiche_conformitestats', { startDate, endDate }).toPromise();
      this.quantiteParNom = this.transformData(response.quantiteParNom);
      this.countParEtatPiece = response.countParEtatPiece;
      this.countParStatut = response.countParStatut;
      this.nonConformePerMonth = this.transformNonConformeData(response.nonConformePerMonth);


      this.transformedNonConformeTableData = this.transformNonConformeTableData(response.nonConformePerMonth);
      this.machineCounttable = this.transformNonConformeTableData(response.machineCount);
      this.machineCount = this.transformNonConformeData(response.machineCount);


      this.countParEtatPiece = [
        { name: 'Conforme', value: response.countParEtatPiece[0].count_etatpiece_conforme },
        { name: 'Non Conforme', value: response.countParEtatPiece[0].count_etatpiece_non_conforme }
      ];

      this.countParStatut = [
        { name: 'Modification', value: response.countParStatut[0].count_statut_modification },
        { name: 'Nouveau', value: response.countParStatut[0].count_statut_nouveau }
      ];
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.spinner.hide();
    }
  }

  transformData(data: any[]): any[] {
    return data.map(item => ({
      name: item.Nom,
      value: item.count_etatpiece_conforme || item.count_etatpiece_non_conforme || item.count_statut_modification || item.count_statut_nouveau || item.Quantite_total_somme
    }));
  }

  onFilterTypeChange() {
    this.onFilterChange();
  }

  onFilterChange() {
    let startDate: string = '';
    let endDate: string = '';

    switch (this.filterType) {
      case 'day':
        startDate = moment(this.selectedDay).startOf('day').format('YYYY-MM-DD');
        endDate = moment(this.selectedDay).endOf('day').format('YYYY-MM-DD');
        break;
      case 'month':
        const [month, year] = this.selectedMonth.split('-');
        startDate = moment(`${year}-${month}-01`).startOf('month').format('YYYY-MM-DD');
        endDate = moment(`${year}-${month}-01`).endOf('month').format('YYYY-MM-DD');
        break;
      case 'year':
        startDate = moment().year(this.selectedYear).startOf('year').format('YYYY-MM-DD');
        endDate = moment().year(this.selectedYear).endOf('year').format('YYYY-MM-DD');
        break;
    }

    this.filteredData = { startDate, endDate };
    this.filterDataByDate();
  }

  async filterDataByDate(): Promise<any> {
    try {
      this.spinner.show();
      const response = await this.http.post<any>('https://192.168.3.2:5000/api/fiche_conformitestats', this.filteredData).toPromise();
      console.log(response);

      this.quantiteParNom = this.transformData(response.quantiteParNom);
      this.countParEtatPiece = response.countParEtatPiece;
      this.countParStatut = response.countParStatut;


      console.log(this.machineCount);
      this.countParEtatPiece = [
        { name: 'Conforme', value: response.countParEtatPiece[0].count_etatpiece_conforme },
        { name: 'Non Conforme', value: response.countParEtatPiece[0].count_etatpiece_non_conforme }
      ];

      this.countParStatut = [
        { name: 'Modification', value: response.countParStatut[0].count_statut_modification },
        { name: 'Nouveau', value: response.countParStatut[0].count_statut_nouveau }
      ];
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.spinner.hide();
    }
  }

  transformNonConformeData(data: any[]): any[] {
    const transformedData: any = [];

    data.forEach(item => {
      let monthName = moment(item.Month, 'M').format('MMMM');
      let machineData = transformedData.find((d: any) => d.name === item.Machine);

      if (machineData) {
        machineData.series.push({ name: monthName, value: item.count_non_conforme });
      } else {
        transformedData.push({
          name: item.Machine,
          series: [{ name: monthName, value: item.count_non_conforme }]
        });
      }
    });
    return transformedData;
  }

  transformNonConformeTableData(data: any[]): any[] {
    const machines = Array.from(new Set(data.map(item => item.Machine)));
    const months = Array.from({ length: 12 }, (_, i) => moment().month(i).format('MMMM'));
    const tableData = machines.map(machine => {
      const rowData: any = { Machine: machine };
      months.forEach(month => rowData[month] = 0);
      return rowData;
    });

    data.forEach(item => {
      const monthName = moment(item.Month, 'M').format('MMMM');
      const machineData = tableData.find(row => row.Machine === item.Machine);
      if (machineData) {
        machineData[monthName] = item.count_non_conforme;
      }
    });

    return tableData;
  }

  onSelect(event: any): void {
    console.log(event);
  }
}
