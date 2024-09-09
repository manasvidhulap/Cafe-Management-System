import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
// import { saveAs } from 'file-saver';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { BillService } from '../../services/bill.service';
import { SnackbarService } from '../../services/snackbar.service';
import { GlobalConstants } from '../../shared/global-constants';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss'],
})
export class ViewBillComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'contactNumber',
    'paymentMethod',
    'total',
    'view',
  ];
  dataSource: any;
  responseMessage: any;

  constructor(
    private billservice: BillService,
    private dialog: MatDialog,
    private SnackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tableData();
  }
  tableData() {
    this.billservice.getBills().subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response);
      },
      (error: any) => {
        console.log(error.error?.message);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.SnackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleViewAction(values: any) {
    const dialogConfog = new MatDialogConfig();
    dialogConfog.data = {
      data: values,
    };
    dialogConfog.width = '100%';
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfog);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }
  handleDeleteAction(values: any) {
    const dialogConfog = new MatDialogConfig();
    dialogConfog.data = {
      message: 'delete ' + values.name + ' bill',
      confirmation: true,
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfog);
    const sub = dialogRef.componentInstance.onEmistStatusChange.subscribe(
      (response) => {
        this.deleteBill(values.id);
        dialogRef.close();
      }
    );
  }
  deleteBill(id: any) {
    this.billservice.delete(id).subscribe(
      (response: any) => {
        this.tableData();
        this.responseMessage = response?.message;
        this.SnackbarService.openSnackBar(this.responseMessage, 'success');
      },
      (error: any) => {
        console.log(error.error?.message);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.SnackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      }
    );
  }
  downloadReportAction(values: any) {
    var data = {
      name: values.name,
      email: values.email,
      uuid: values.uuid,
      contactNumber: values.contactNumber,
      paymentMethod: values.paymentMethod,
      totalAmount: values.total.toString(),
      productDetails: values.productDetails,
    };
    this.downloadFile(values.uuid, data);
  }
  downloadFile(fname: string, data: any) {
    this.billservice.getPdf(data).subscribe((response: any) => {
      const blob: Blob = new Blob([response], { type: 'application/pd' });
      const fileName: string = fname + '.pdf';
      const objectUrl: string = URL.createObjectURL(blob);
      const a: HTMLAnchorElement = document.createElement(
        'a'
      ) as HTMLAnchorElement;

      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    });
  }
}