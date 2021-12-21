import {Component, OnInit} from '@angular/core';
import * as p5 from 'p5';

@Component({
  selector: 'app-root',
  templateUrl: './appContainer.html',
  styleUrls: ['./appContainer.less']
})
export class AppContainerComponent implements OnInit {
  constructor() {
    console.log("test");
  }

  ngOnInit(): void {
    const sketch = (s: any) => {

      s.preload = () => {
        // preload code
      }

      s.setup = () => {
        const canvas = s.createCanvas(400, 400);
        canvas.parent("canvas");
      };

      s.draw = () => {
        s.background(0);
        s.rect(100, 100, 100, 100);
      };
    }

    let canvas = new p5(sketch);
  }
}
