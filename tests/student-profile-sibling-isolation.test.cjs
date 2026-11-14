"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const html=fs.readFileSync(path.join(__dirname,"../student-profile/index.html"),"utf8");
test("sibling selection requires current adult and linked learner membership",()=>{
 assert.ok(html.includes('R?.getAdult?.(ids.adultId)'));
 assert.ok(html.includes('R?.canAdult?.(ids.adultId,id,"progress.view")===true'));
 assert.ok(html.includes('family?.adultIds?.includes(ids.adultId)'));
 assert.ok(html.includes('family&&l?.familyId===family.familyId&&family.learnerIds?.includes(l.learnerId)'));
});
test("sibling switch verifies persisted family adult and learner",()=>{
 assert.ok(html.includes('after.familyId!==family.familyId'));
 assert.ok(html.includes('after.adultId!==ids.adultId'));
 assert.ok(html.includes('after.learnerId!==id'));
 assert.ok(html.includes('Existing work is unchanged.'));
});
test("pending picture work is invalidated across learner changes and removal",()=>{
 assert.ok(html.includes('pictureRequest++; // Invalidate pending picture writes when learner identity changes.'));
 assert.ok(html.includes('request!==pictureRequest'));
 assert.ok(html.includes('pictureRequest++;appearance.photo=""'));
});
test("native visual backup disclosure and adaptive compression remain present",()=>{
 assert.ok(html.includes("are not encrypted. Keep backups private."));
 assert.ok(html.includes('for(const quality of [.78,.64,.50,.38])'));
});
