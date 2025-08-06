import { Component, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilterService, GridComponent, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth';
import { PageInfoService } from 'src/app/_metronic/layout';
import { ReturnRequestRejectComponent } from '../_components/return-request-reject/return-request-reject.component';
import { ReturnRequestApproveComponent } from '../_components/return-request-approve/return-request-approve.component';
import { ReturnRequestFinishComponent } from '../_components/return-request-finish/return-request-finish.component';

@Component({
  selector: 'app-return-request-list',
  standalone: true,
  imports: [GridModule, RouterLink, NgbModalModule],
  providers: [SortService, FilterService, PageService],
  templateUrl: './return-request-list.component.html',
  styleUrl: './return-request-list.component.scss'
})
export class ReturnRequestListComponent {
private page = inject(PageInfoService);
  private authService = inject(AuthService);
  private modalService = inject(NgbModal);
  @ViewChild('grid') grid: GridComponent;
  
  data = new DataManager({
    url: `${environment.backendUrl}/odata/ReturnRequestsOdata`,
    adaptor: new ODataV4Adaptor(),
    crossDomain: true,
    headers: [{ Authorization: 'Bearer ' + this.authService.getAuthFromLocalStorage()?.AccessToken }]
  });

  ngOnInit(): void {
    this.page.updateTitle('Cancel Requests');
  }

  showRejectModal(orderId: number) {
    const modalRef = this.modalService.open(ReturnRequestRejectComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.orderId = orderId;
    
    modalRef.result.then(
      (result) => {
        if (result) {
          this.grid.refresh();
        }
      },
      () => {}
    );
  }

  showApproveModal(orderId: number) {
    const modalRef = this.modalService.open(ReturnRequestApproveComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.orderId = orderId;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.grid.refresh();
        }
      },
      () => {}
    );
  }

  showFinishModal(order: any) {
    const modalRef = this.modalService.open(ReturnRequestFinishComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.order = order;
    
    modalRef.result.then(
      (result) => {
        if (result) {
          this.grid.refresh();
        }
      },
      () => {}
    );
  }
}
