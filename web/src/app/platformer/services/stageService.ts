import { Injectable } from "@angular/core";
import { RendererService } from "./rendererService";

@Injectable({
    providedIn: 'root'
})
export class StageService {
    constructor(private _rendererService: RendererService) {

    }
}
