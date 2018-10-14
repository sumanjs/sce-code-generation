"use strict";

import { SceEvent } from "sce-plugin-typings";

export interface AbstractGeneratorOptions {
  coalesceText?: boolean;
  testName: string;
}

export abstract class AbstractGenerator {
  constructor(
    public options: AbstractGeneratorOptions = { testName: "SCE Auto-Generated Test" }
  ) {}
  private _getShortestXPath(event: SceEvent) {
    let options = [
      event.xpath.bodyXPath,
      event.xpath.classXPath,
      event.xpath.idXPath,
    ].filter(item => item != null && item.length > 0);

    if (options.length === 0) return "";

    let best = 0;
    let minLength = options[0].length;
    for (let i = 1; i < options.length; ++i) {
      if (options[i].length < minLength) {
        minLength = options[i].length;
        best = i;
      }
    }

    return options[best];
  }

  public generate(events: SceEvent[]) {
    let result = this.getHeader();

    let currentText = "";
    let collectingTextFrom = null;

    for (const event of events) {
      const shortestXpath = this._getShortestXPath(event);
      if (
        collectingTextFrom != null &&
        (event.eventName !== "keyup" || collectingTextFrom !== shortestXpath)
      ) {
        result += this.getText(event, currentText, shortestXpath);
        collectingTextFrom = null;
        currentText = "";
        continue;
      }
      switch (event.eventName) {
        case "sumanload":
          result += this.getNavigate(event, event.location.href);
          break;
        case "click":
          result += this.getClick(event, shortestXpath);
          break;
        case "keyup":
          if (this.options.coalesceText) {
            currentText += event.event.target.value;
            break;
          }
          result += this.getText(event, event.event.target.value, shortestXpath);
          break;
      }
    }

    result += this.getFooter();
    return result;
  }

  abstract getHeader(): string;
  abstract getNavigate(event: SceEvent, url: string): string;
  abstract getClick(event: SceEvent, shortestXpath: string): string;
  abstract getText(event: SceEvent, text: string, shortestXpath: string): string;
  abstract getFooter(): string;
}
