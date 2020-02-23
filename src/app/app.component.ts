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
  logger: string[] = [];
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
    let step1Status: RenderRow[];
    let step2Status: RenderRow[];
    let step3Status: RenderRow[];

    // @ts-ignore
    this._differs = iterableDiffers.find([]).create<RenderRow>((index, item) => {
      return item.data.id;
    });

    this._differs.diff(this.baseOrder);

    this.logToScreen('---- STEP 1: I\'m removing one element from index [1] ----');
    this._differs.diff(this.changedOrder);
    step1Status = [...this._differs.collection];
    this._differs.forEachOperation(console.log);
    this.logToScreen(`
+--------------------+               |       +--------------------+
| id: abc, index: 0  |               |       | id: abc, index: 0  |
+--------------------+               |       +--------------------+
| id: abc, index: 1  |  <-- REMOVE   |       | id: def, index: 2  |
+--------------------+               |       +--------------------+
| id: def, index: 2  |               | =>    | id: def, index: 3  |
+--------------------+               | =>    +--------------------+
| id: def, index: 3  |               | =>    | id: vwx, index: 4  |
+--------------------+               |       +--------------------+
| id: vwx, index: 4  |               |       | id: xyz, index: 5  |
+--------------------+               |       +--------------------+
| id: xyz, index: 5  |               |
+--------------------+               |
    `);
    console.log('\n\n\n');

    this.logToScreen('---- STEP 2: I\'m readding the same element to index [1] ----');
    this._differs.diff(this.baseOrder);
    step2Status = [...this._differs.collection];
    this._differs.forEachOperation(console.log);
    this.logToScreen(`
+--------------------+               |       +--------------------+
| id: abc, index: 0  |               |       | id: abc, index: 0  |
+--------------------+  <-- INSERT   |       +--------------------+
| id: def, index: 2  |               |       | id: abc, index: 1  |
+--------------------+               |       +--------------------+
| id: def, index: 3  |               | =>    | id: def, index: 2  |
+--------------------+               | =>    +--------------------+
| id: vwx, index: 4  |               | =>    | id: def, index: 3  |
+--------------------+               |       +--------------------+
| id: xyz, index: 5  |               |       | id: vwx, index: 4  |
+--------------------+               |       +--------------------+
                                     |       | id: xyz, index: 5  |
                                     |       +--------------------+
    `);
    console.log('\n\n\n');

    this.logToScreen('---- STEP 3: I\'m removing that element from index [1] again (Should be the same as in STEP 1) ----');
    this._differs.diff(this.changedOrder);
    step3Status = [...this._differs.collection];
    this._differs.forEachOperation(console.log);
    this.logToScreen(`
+--------------------+               |       +--------------------+
| id: abc, index: 0  |               |       | id: abc, index: 0  |
+--------------------+ <-+           |       +--------------------+
| id: abc, index: 1  |   |<-- REMOVE |       | id: def, index: 3  |  <-- notice that the index 3 is before 2.
+--------------------+   |           |       +--------------------+
| id: def, index: 2  |   |           | =>    | id: def, index: 2  |
+--------------------+   |           | =>    +--------------------+
| id: def, index: 3  | --+ POSITION  | =>    | id: vwx, index: 4  |
+--------------------+      CHANGE   |       +--------------------+
| id: vwx, index: 4  |               |       | id: xyz, index: 5  |
+--------------------+               |       +--------------------+
| id: xyz, index: 5  |               |
+--------------------+               |
    `);
    this.logToScreen('!!! The differs\' internal collection reflects the order CORRECTLY, but the operations, which Angular CDK Table uses internally tells something else.');
    console.log('Step 1: ', step1Status);
    console.log('Step 2: ', step2Status);
    console.log('Step 3: ', step3Status);
    console.log('\n\n\n');

    console.log(this._differs);
  }

  private logToScreen(message: string) {
    this.logger.push(message);
    console.log(message);
  }
}
