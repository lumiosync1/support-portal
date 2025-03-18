import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilterService, GridComponent, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { PageInfoService } from 'src/app/_metronic/layout';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-seller-list',
  standalone: true,
  imports: [
    GridModule,
    RouterLink,
  ],
  providers: [SortService, FilterService, PageService],
  templateUrl: './seller-list.component.html',
  styleUrl: './seller-list.component.scss'
})
export class SellerListComponent {
  private page = inject(PageInfoService);
  private authService = inject(AuthService);

  data = new DataManager({
    url: `${environment.backendUrl}/odata/sellersodata`,
    adaptor: new ODataV4Adaptor(),
    crossDomain: true,
    headers: [{ Authorization: 'Bearer ' + this.authService.getAuthFromLocalStorage()?.AccessToken }]
  });

  ngOnInit(): void {
    this.page.updateTitle('Sellers');
  }
}
