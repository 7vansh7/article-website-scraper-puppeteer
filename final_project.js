// JUST ADD THE COOKIES FUNCTION TO MAKE THE APP PERFECT
//  TRY TO UNDERSTAND THE LOGIC BETTER

const puppeteer = require("puppeteer");
const fs = require("fs/promises");
async function start() {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("https://www.economist.com/finance-and-economics?utm_source=google&utm_medium=cpc.adword.pd&utm_campaign=a.non-brand.generic&utm_content=conversion.non-brand.anonymous_search-generic-core_en-g-economyfinance-phrase&gclid=CjwKCAjwqJSaBhBUEiwAg5W9pycFiBmPaLQ1yp_p1u-h0eUN48H_JdLNPveLVMVGEM1hiTqDSGGSiRoCeGYQAvD_BwE&gclsrc=aw.ds", {
    waitUntil: ['domcontentloaded','load','networkidle0','networkidle2'],
  });
 
  let is_disabled = false;
  while (!is_disabled) {
    let dom = await page.$('#sp_message_iframe_717177',{waitUntil:['domcontentloaded','load','networkidle0','networkidle2']}) 
    
    if(dom !== null){
    const frameHandle = await  page.$('#sp_message_iframe_717177')
    const frame =  await frameHandle.contentFrame()
    await frame.click('div.message-component.message-column.teg-stackable--accept > button')}
    
   

    await page.waitForSelector(".css-na6i28.eifj80y0");
    const products = await page.$$(".css-na6i28.eifj80y0");
    const array = []
    const Url = page.url();

    for (const product of products) {
      const Title = await page.evaluate(
        (el) => el.querySelector("a").textContent,
        product
      );
      const src = await page.evaluate(
        (el) => el.querySelector("a").getAttribute("href"),
        product
      );
      const Link = "https://www.economist.com" + src;
      array.push({ Title, Link , Url});
    }

    const btn =
      (await page.$(
        ".ds-pagination__nav.ds-pagination__nav--next.ds-pagination__nav--disabled"
      )) !== null;

    is_disabled = btn;
    if (!btn) {
      await Promise.all([
        await page.waitForSelector(
          ".ds-pagination__nav.ds-pagination__nav--next > a"
        ),
        page.click(".ds-pagination__nav.ds-pagination__nav--next > a "),
        page.waitForNavigation({ waitUntil: "load" }),
      ]);
    }
    await fs.appendFile("array.json", JSON.stringify(array, null, `\t`));
    console.log(array.length);
  }
  await browser.close();
}
start();
