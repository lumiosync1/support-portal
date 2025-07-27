import { Component, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilterService, GridComponent, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth';
import { PageInfoService } from 'src/app/_metronic/layout';
import { CancelRequestRejectComponent } from '../_components/cancel-request-reject/cancel-request-reject.component';
import { CancelRequestApproveComponent } from '../_components/cancel-request-approve/cancel-request-approve.component';

@Component({
  selector: 'app-cancel-request-list',
  standalone: true,
  imports: [GridModule, RouterLink, NgbModalModule],
  providers: [SortService, FilterService, PageService],
  templateUrl: './cancel-request-list.component.html',
  styleUrl: './cancel-request-list.component.scss'
})
export class CancelRequestListComponent {
  private page = inject(PageInfoService);
  private authService = inject(AuthService);
  private modalService = inject(NgbModal);
  @ViewChild('grid') grid: GridComponent;
  
  data = new DataManager({
    url: `${environment.backendUrl}/odata/CancelRequestsOdata`,
    adaptor: new ODataV4Adaptor(),
    crossDomain: true,
    headers: [{ Authorization: 'Bearer ' + this.authService.getAuthFromLocalStorage()?.AccessToken }]
  });

  ngOnInit(): void {
    this.page.updateTitle('Cancel Requests');
  }

  showRejectModal(orderId: number) {
    const modalRef = this.modalService.open(CancelRequestRejectComponent, {
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
    const modalRef = this.modalService.open(CancelRequestApproveComponent, {
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
}
