import { AbstractGenerator } from "./abstractgenerator";
import { SceEvent } from "sce-plugin-typings";

export class TypeScriptGenerator extends AbstractGenerator {
  public getClick(event: SceEvent, shortestXpath: string) {
    return `
    describe("click", async () => {
      before(async () => {
        // Action (will throw on an action failure)
        await session.click(By.xpath("${shortestXpath}"));
        // Alternate version of action that uses body xpath
        // await test.click(By.xpath("${event.xpath.bodyXPath}"));
        // Alternate version of action that uses class xpath
        // await test.click(By.xpath("${event.xpath.classXPath}"));
      });

      // Then one "it" clause per action.
      // If a user desires, the individual lines (like test.click) could
      // be moved into the "before" clause above. It doesn't make a difference
      // except how any error is reported.
      it("User can click on [link]", async () => {
        // Assert
        await Promise.all([
          // await test.ensure(By.css("some css selector")).isEnabled(),
          // await test.ensure(By.xpath("some xpath")).hasText("some text"),
        ]);
      });
    });`;
  }
  public getHeader() {
    return `
    import "chromedriver";
    import { By } from "selenium-webdriver";
    import { SCETestHelper } from "@sce/code-generation";

    // Tool will output a single top-level "describe" block
    describe("${this.options.testName}", () => {
      // It then creates a "test" object, which is used below.
      const session = new SCETestHelper("chrome");`;
  }
  public getNavigate(event: SceEvent, url: string) {
    return `
    describe("navigate", async () => {
      // Navigate to the page.
      before(async () => {
        await session.get("${url}");
      });

      it("Page loaded", async () => {
        // Assert
        await Promise.all([
          // await session
          //   .ensure(By.id("some id"))
          //   .hasText("some text"),
          // await test.ensure(By.css("some other css selector")).hasText("some text"),
        ]);
      });
    });
`;
  }
  public getText(event: SceEvent, text: string, shortestXpath: string) {
    return `
    describe("text", async () => {
      before(async () => {
        // Action (will throw on an action failure)
        await session.sendKeys(By.xpath("${shortestXpath}"), "${text}");
        // Alternate version of action that uses body xpath
        // await test.click(By.xpath("${event.xpath.bodyXPath}"));
        // Alternate version of action that uses class xpath
        // await test.click(By.xpath("${event.xpath.classXPath}"));
      });

      // The second action in this example.
      it("User can type in text", async () => {
        // Assert
        await Promise.all([
          // await test.ensure(By.css("some css selector")).isEnabled(),
          // await test.ensure(By.css("some other css selector")).hasText("some text"),
        ]);
      });
    });
`;
  }
  public getFooter() {
    return `
    // The "shutdown" that closes out the browser.
    after(async () => {
      await session.close();
    });
  });
`;
  }
}
