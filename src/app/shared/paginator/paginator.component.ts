import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @Input("mfTable") mfTable:any;
  @Input("lang") lang:any;
  @Input("rowsOnPageSet") rowsOnPageSet = [];
  minRowsOnPage=0;
  math=Math
  constructor() { }

  ngOnInit() {
  }
    ngOnChanges(changes: any): any {
        if (changes.rowsOnPageSet) {
            this.minRowsOnPage = Math.min(...this.rowsOnPageSet)
        }
    }
}
