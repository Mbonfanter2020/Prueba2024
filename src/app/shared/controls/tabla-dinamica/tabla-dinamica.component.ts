
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-tabla-dinamica',
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.scss'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
})
export class TablaDinamicaComponent implements AfterViewInit  {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator)  paginator !:MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}



export interface PeriodicElement {
  name: string;
  position: number;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Imagen1', weight:'200 KB', symbol: 'JPG'},
  {position: 2, name: 'Video', weight: '100 MB', symbol: 'MP4'},
];
