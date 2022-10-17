// Best of luck to whoever is using my code

// basic requirements
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
//  initializing the 'next page' button on the page with the name is_disabled
  let is_disabled = false;
  while (!is_disabled) {
    let dom = await page.$('#sp_message_iframe_717177',{waitUntil:['domcontentloaded','load','networkidle0','networkidle2']}) 
//     dom is the name of a 'accept cookies' prompt which appears sometimes
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
// further code is or pagination 
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
//     further code is for making a json file with the collected data
    await fs.appendFile("articles.json", JSON.stringify(array, null, `\t`));
    console.log(array.length);
  }
  await browser.close();
}
start();


