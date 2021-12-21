import {Component, OnDestroy, OnInit} from '@angular/core';
import * as p5 from 'p5';
import {PlatformerSketch} from "./platformer/platformerSketch";

@Component({
  selector: 'app-root',
  templateUrl: './appContainer.html',
  styleUrls: ['./appContainer.less']
})
export class AppContainerComponent implements OnInit, OnDestroy {
  private sketch?: p5;

  constructor() {
    console.log("test");
  }

  ngOnInit(): void {
    this.sketch = new PlatformerSketch().initSketch();
  }

  ngOnDestroy(): void {
    this.sketch?.remove();
  }
}
