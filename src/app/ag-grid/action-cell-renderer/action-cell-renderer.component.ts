import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-action-cell-renderer',
  templateUrl: './action-cell-renderer.component.html',
  styleUrls: ['./action-cell-renderer.component.scss']
})
export class ActionCellRendererComponent implements ICellRendererAngularComp {

  params: any;
  data:any;

  agInit(params: any): void {
    this.params = params;
    this.data = this.params.data;
    console.log("this.params" , this.params)
  }

  refresh(): boolean {
    return false;
  }

  approve() {
    this.params.context.componentParent.onApprove(this.params.data);
  }

  reject() {
    this.params.context.componentParent.onReject(this.params.data);
  }

  menuAction(action: string) {
    this.params.context.componentParent.onMenuAction(action, this.params.data);
  }

}
