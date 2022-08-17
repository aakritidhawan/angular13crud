import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular13crud';
  displayedColumns: string[] = ['itemName', 'itemCategory', 'itemDateOfArrival', 'itemSource', 'itemPrice', 'comments', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.getAllItems();
    this.displayedColumns.forEach(item => {
      console.log(item);
    })
  }

  getAllItems() {
    this.apiService.getItems().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {}
    })
  }

  openDialogForEditingItem(rowData: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: rowData
    }).afterClosed().subscribe({
      next: (val) => {
        console.log('val', val);
        this.getAllItems();
      }
    });
    }

  openDialogForNewItem() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe({
      next: (val) => {
        console.log('val', val);
        this.getAllItems();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteItem(id: number) {
    this.apiService.deleteItem(id).subscribe({
      next: (res) => {
        console.log('deleted!');
        this.getAllItems();
      }
    })
  }
}
