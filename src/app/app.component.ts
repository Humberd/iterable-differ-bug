import { Component, DefaultIterableDiffer, IterableDiffer, IterableDiffers } from '@angular/core';

interface RenderRow {
  data: {
    id: string,
  };
  dataIndex: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private _differs: DefaultIterableDiffer<RenderRow>;

  baseOrder: RenderRow[] = [
    {data: {id: 'abc'}, dataIndex: 0},
    {data: {id: 'abc'}, dataIndex: 1},
    {data: {id: 'def'}, dataIndex: 2},
    {data: {id: 'def'}, dataIndex: 3},
    {data: {id: 'vwx'}, dataIndex: 4},
    {data: {id: 'xyz'}, dataIndex: 5},
  ];

  changedOrder: RenderRow[] = [
    {data: {id: 'abc'}, dataIndex: 0},
    {data: {id: 'def'}, dataIndex: 2},
    {data: {id: 'def'}, dataIndex: 3},
    {data: {id: 'vwx'}, dataIndex: 4},
    {data: {id: 'xyz'}, dataIndex: 5},
  ];

  constructor(iterableDiffers: IterableDiffers) {
    // @ts-ignore
    this._differs = iterableDiffers.find([]).create<RenderRow>((index, item) => {
      return item.data.id;
    });

    this._differs.diff(this.baseOrder);
    console.log('---- Initial population ----');
    this._differs.forEachOperation(console.log);

    this._differs.diff(this.changedOrder);
    console.log('---- Should be 1 change ----');
    this._differs.forEachOperation(console.log);
    console.log('----------------------------');

    this._differs.diff(this.baseOrder);
    console.log('---- Should be 1 change ----');
    this._differs.forEachOperation(console.log);
    console.log('----------------------------');

    this._differs.diff(this.changedOrder);
    console.log('---- Should be 1 change ----');
    this._differs.forEachOperation(console.log);
    console.log('----------------------------');
  }
}
