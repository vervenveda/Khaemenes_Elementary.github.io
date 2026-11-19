#!/usr/bin/env node
import fs from "node:fs";
const regulator="assets/elementary-global-standard-v1.js";
const banned=[
 "tools/elementary-global-standard-audit.mjs",
 "tools/semantic-hierarchy-audit.mjs",
 ".github/workflows/elementary-global-standard.yml"
];
const problems=[];
for(const p of banned) if(fs.existsSync(p)) problems.push("forbidden retired regulator authority exists: "+p);
if(!fs.existsSync(regulator)) problems.push("compatibility shim missing: "+regulator);
else{
 const src=fs.readFileSync(regulator,"utf8");
 if(!src.includes('khaemenesPageRegulator="retired"')) problems.push("Elementary compatibility shim is not marked retired.");
 for(const token of ["MutationObserver","VNV_HEADER","VNVEcosystemToolbar","vnv-333-ticker.js","vnv-ticker-autopopulate.js","enforceFloor","normalizeHierarchy"]){
  if(src.includes(token)) problems.push("active regulator token returned: "+token);
 }
}
if(problems.length){console.error(JSON.stringify({status:"FAIL",problems},null,2));process.exit(1)}
console.log(JSON.stringify({status:"PASS",school:"Elementary",policy:"runtime page regulator retired; reinjection authority absent"},null,2));
