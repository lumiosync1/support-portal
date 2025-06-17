import { Component, inject, ViewChild } from '@angular/core';
import { FilterService, GridComponent, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth';
import { RouterLink } from '@angular/router';
import { PageInfoService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-supplier-account-list',
  standalone: true,
  imports: [GridModule, RouterLink],
  providers: [SortService, FilterService, PageService],
  templateUrl: './supplier-account-list.component.html',
  styleUrl: './supplier-account-list.component.scss'
})
export class SupplierAccountListComponent {
  private page = inject(PageInfoService);
  private authService = inject(AuthService);
  @ViewChild('grid') grid: GridComponent;
  
  data = new DataManager({
    url: `${environment.backendUrl}/odata/supplieraccountsodata`,
    adaptor: new CustomODataV4Adaptor(),
    crossDomain: true,
    headers: [{ Authorization: 'Bearer ' + this.authService.getAuthFromLocalStorage()?.AccessToken }]
  });

  ngOnInit(): void {
    this.page.updateTitle('Supplier Accounts');
  }
}

class CustomODataV4Adaptor extends ODataV4Adaptor {
  processResponse(data: any, dataManager: DataManager, query: Query): any {
    // Extract the data from the OData response (usually in 'value' property)
    let result = data['value'] || data;
    let count = data['@odata.count'] || (Array.isArray(result) ? result.length : 0);

    // Transform the data
    result = result.map((item: any, index: number) => {
      const settings = JSON.parse(item.protection_settings);
      item.max_orders_24h = settings.MaxOrders24Hour;
      item.max_orders_1h = settings.MaxOrders1Hour;

      return item;
    });

    // Return the transformed data in the expected format
    return query.isCountRequired ? { result, count } : result;
  }
}
