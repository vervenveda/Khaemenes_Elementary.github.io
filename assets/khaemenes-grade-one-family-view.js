(function(global){
"use strict";
if(global.KhaemenesGradeOneFamilyView)return;
const $=id=>document.getElementById(id);
function selected(){
 const R=global.KhaemenesFamilyRegistry,ids=R?.activeIds?.()||{};
 const child=R?.getLearner?.(ids.learnerId),family=R?.getFamily?.(ids.familyId);
 return child&&family&&child.learnerId===ids.learnerId&&child.familyId===family.familyId&&
  child.stage==="elementary"&&child.grade==="01"&&child.selfDirectedAdult!==true&&
  family.learnerIds?.includes(child.learnerId)?child:null;
}
function read(){
 const child=selected();
 return child
  ?{kind:"linked",learnerId:child.learnerId,nickname:child.nickname||"Learner",grade:"01",academic:"pending"}
  :{kind:"unavailable"};
}
function render(){
 const panel=$("gradeOneFamilyOverview"),status=$("gradeOneFamilyOverviewStatus");
 if(!panel||!status)return;
 const result=read();
 panel.hidden=result.kind!=="linked";
 if(result.kind==="linked"){
  status.textContent="Grade 1 family profile linked for "+result.nickname+". Academic progress reporting is pending verification of learner-owned source records; no old scores were imported.";
 }else{
  status.textContent="Select the registered Grade 1 child in the Family Learning Center to view this panel.";
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});else render();
for(const name of ["pageshow","khaemenes-family-changed","khaemenes-learner-placement-changed"])
 global.addEventListener(name,render);
global.addEventListener("storage",event=>{
 if(event.key==="khaemenes_family_registry_v1"||event.key==="khaemenes_active_learner_v1")render();
});
global.KhaemenesGradeOneFamilyView=Object.freeze({version:"1.0.0",read,render});
})(window);
