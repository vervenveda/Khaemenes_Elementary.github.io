import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {chromium} from "playwright";
const root=process.cwd(),academy=path.join(root,"shared-academy");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json"};
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1024,height:860},acceptDownloads:true,reducedMotion:"reduce"});
const page=await context.newPage(),errors=[];
page.on("pageerror",e=>errors.push(e.message));
await page.route("https://vervenveda.com/**",async route=>{
 const p=new URL(route.request().url()).pathname;let home=root,local=p;
 if(p.startsWith("/Khaemenes_Elementary.github.io/"))local=p.slice("/Khaemenes_Elementary.github.io".length);
 else if(p.startsWith("/Khaemenes_Academy.github.io/")){home=academy;local=p.slice("/Khaemenes_Academy.github.io".length)}
 else return route.fulfill({status:404,body:"Unmapped test asset"});
 let filename=path.resolve(home,"."+local);
 if(!filename.startsWith(home+path.sep)&&filename!==home)return route.fulfill({status:403});
 try{if(fs.statSync(filename).isDirectory())filename=path.join(filename,"index.html");await route.fulfill({status:200,body:fs.readFileSync(filename),contentType:mime[path.extname(filename)]||"application/octet-stream"})}
 catch{return route.fulfill({status:404,body:"Missing test asset"})}
});
const url="https://vervenveda.com/Khaemenes_Elementary.github.io/student-profile/";
try{
 await page.goto(url,{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#profileStudio").isVisible(),false);
 assert.match(await page.locator("#accountNote").innerText(),/No eligible Elementary learner/);
 console.log("PASS guest cannot create or impersonate an Elementary learner");
 const ids=await page.evaluate(()=>{
  const R=window.KhaemenesFamilyRegistry;
  if(!R)throw new Error("Family registry absent");
  const f=R.createFamily({displayName:"Elementary QA",adultName:"QA Guardian"});
  const first=R.registerLearner({familyId:f.familyId,nickname:"Reading Star",stage:"elementary",grade:"01"});
  const second=R.registerLearner({familyId:f.familyId,nickname:"Science Star",stage:"elementary",grade:"03"});
  R.setActive({familyId:f.familyId,learnerId:first.learnerId});
  return {first:first.learnerId,second:second.learnerId};
 });
 assert.equal(await page.locator("#childName").innerText(),"Reading Star");
 assert.equal(await page.locator("#gradePill").innerText(),"Grade 1");
 assert.match(await page.locator("#gradeHomeLink").getAttribute("href"),/grades\/grade-01\/$/);
 assert.equal(await page.locator("#learnerSelect option").count(),2);
 assert.equal(await page.locator("#profileStudio").isVisible(),true);
 console.log("PASS registered grade drives the profile, not an editable grade selector");
 await page.locator("#subjectSelect").selectOption("Math Practice");
 await page.locator("#pinSubject").click();
 assert.match(await page.locator("#pinned").innerText(),/Math Practice/);
 await page.locator("#adultConfirm").check();
 await page.locator("#themes button[data-value='forest']").click();
 assert.equal(await page.locator("body").getAttribute("data-theme"),"forest");
 await page.reload({waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("body").getAttribute("data-theme"),"forest");
 assert.match(await page.locator("#pinned").innerText(),/Math Practice/);
 console.log("PASS Grade 1 subject pin and appearance survive reload");
 await page.locator("#adultConfirm").check();
 await page.locator("#avatars button[data-value='🦋']").click();
 assert.equal((await page.locator("#portrait").innerText()).trim(),"🦋");
 const tiny=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9pXmKr8AAAAASUVORK5CYII=","base64");
 await page.locator("#photoFile").setInputFiles({name:"qa.png",mimeType:"image/png",buffer:tiny});
 await page.locator("#portrait img").waitFor({state:"attached",timeout:3000});
 await page.locator("#pv2Goal").fill("Practice reading aloud");
 await page.locator("#pv2SaveCompass").click();
 await page.locator("#learnerSelect").selectOption(ids.second);
 assert.equal(await page.locator("#childName").innerText(),"Science Star");
 assert.equal(await page.locator("#gradePill").innerText(),"Grade 3");
 assert.equal(await page.locator("#portrait img").count(),0);
 assert.equal(await page.locator("body").getAttribute("data-theme"),"parchment");
 assert.doesNotMatch(await page.locator("#pinned").innerText(),/Math Practice/);
 assert.notEqual(await page.locator("#pv2Goal").inputValue(),"Practice reading aloud");
 await page.locator("#subjectSelect").selectOption("Science");
 await page.locator("#pinSubject").click();
 assert.match(await page.locator("#pinned").innerText(),/Science/);
 await page.locator("#learnerSelect").selectOption(ids.first);
 assert.match(await page.locator("#pinned").innerText(),/Math Practice/);
 assert.doesNotMatch(await page.locator("#pinned").innerText(),/Science/);
 assert.equal(await page.locator("#portrait img").count(),1);
 assert.equal(await page.locator("#pv2Goal").inputValue(),"Practice reading aloud");
 assert.equal(await page.evaluate(()=>window.KhaemenesFamilyRegistry.getLearner().grade),"01");
 console.log("PASS Grade 1 and Grade 3 identity, goals, subject pins and photos remain separate");
 await page.locator("#adultConfirm").check();
 await page.evaluate(id=>localStorage.setItem("khaemenes_kindergarten_visual_profile_v1:"+encodeURIComponent(id),JSON.stringify({
  schema:"khaemenes.kindergarten-visual.v1",learnerId:id,theme:"sunset",avatar:"🦉",photo:""
 })),ids.first);
 await page.locator("#bringKinder").click();
 assert.equal(await page.locator("body").getAttribute("data-theme"),"sunset");
 assert.equal(await page.evaluate(()=>window.KhaemenesFamilyRegistry.getLearner().grade),"01");
 console.log("PASS family-approved Kindergarten visual handoff does not alter Grade 1 placement");
 const before=await page.evaluate(()=>localStorage.getItem("khaemenes_elementary_visual_profile_v1:"+encodeURIComponent(window.KhaemenesFamilyRegistry.getLearner().learnerId)));
 const wrong={schema:"khaemenes.elementary-visual.v1",learnerId:ids.second,theme:"night",avatar:"🌿",photo:""};
 await page.locator("#importVisual").setInputFiles({name:"wrong.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(wrong))});
 await page.waitForFunction(()=>/belongs to another learner/.test(document.getElementById("status")?.textContent||""),null,{timeout:3000});
 const after=await page.evaluate(()=>localStorage.getItem("khaemenes_elementary_visual_profile_v1:"+encodeURIComponent(window.KhaemenesFamilyRegistry.getLearner().learnerId)));
 assert.equal(after,before);
 console.log("PASS cross-child backup import rejected without changes");
 await page.setViewportSize({width:390,height:844});
 const widths=await page.evaluate(()=>({view:innerWidth,scroll:document.documentElement.scrollWidth}));
 assert.ok(widths.scroll<=widths.view+5,"Elementary mobile overflow: "+JSON.stringify(widths));
 assert.deepEqual(errors,[],"uncaught errors: "+JSON.stringify(errors));
 console.log("PASS Elementary Grades 1–5 shared profile browser smoke");
}finally{await context.close();await browser.close()}