"use strict";
import {
  ThenableWebDriver,
  Builder,
  By,
  WebElement,
  promise as seleniumPromise,
} from "selenium-webdriver";

export class ElementAsserts {
  constructor(private _element: WebElement, private _selector: By) {}

  async getElementPrettyName() {
    const tag = await this._element.getTagName();

    return `${tag} @ ${this._selector.toString()}`;
  }

  async hasText(expectedText: string) {
    const text = await this._element.getText();
    if (expectedText === text) {
      return;
    }
    throw new Error(
      `${await this.getElementPrettyName()} has text ${text}, but expected ${expectedText}`
    );
  }

  async isEnabled() {
    if ((await this._element.getAttribute("disabled")) !== "disabled") {
      return;
    }
    throw new Error(`${await this.getElementPrettyName()} is disabled; expected enabled`);
  }
  async isDisabled() {
    if ((await this._element.getAttribute("disabled")) === "disabled") {
      return;
    }
    throw new Error(`${await this.getElementPrettyName()} is enabled; expected disabled`);
  }
}

export class SCETestHelper {
  private _driver: ThenableWebDriver;
  constructor(browserType: string) {
    this._driver = new Builder().forBrowser(browserType).build();
  }
  get driver() {
    return this._driver;
  }
  get(url: string) {
    return this._driver.get(url);
  }
  async click(selector: By) {
    // Should wait (until timeout) for the element to be loaded (and throw on failure)
    const element = await this._driver.findElement(selector);
    await element.click();
  }
  async sendKeys(
    selector: By,
    ...varArgs: Array<string | number | seleniumPromise.Promise<string | number>>
  ) {
    // Should wait (until timeout) for the element to be loaded (and throw on failure)
    const element = await this._driver.findElement(selector);
    await element.sendKeys(...varArgs);
  }
  /**
   * Test whether an element exists (without throwing on failure).
   * @param selector Element to test for existence.
   */
  async exists(selector: By) {
    const elements = await this._driver.findElements(selector);
    return elements.length > 0;
  }
  /**
   * Assert that something is true about an element.
   *
   * Return an ElementAsserts object which can be used to test assertions about the element.
   *
   * @param selector Element to test.
   */
  ensure(selector: By) {
    return new ElementAsserts(this._driver.findElement(selector), selector);
  }

  async close() {
    await this._driver.close();
  }
}
