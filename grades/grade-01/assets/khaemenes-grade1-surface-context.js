(function attachKhaemenesGrade1SurfaceContext(global){
  "use strict";
  const VERSION="1.1.0";
  const COURSE_ID="elementary-grade-01";
  const BETA_SRC="https://vervenveda.com/assets/vnv-beta-link.js";

  function registry(){return global.KhaemenesFamilyRegistry||null}
  function continuity(){return global.KhaemenesGrade1Continuity||null}
  function learner(){return registry()?.getLearner?.()||null}
  function clean(v,max=120){return String(v??"").trim().slice(0,max)}

  function ensureBetaDoorway(){
    if(typeof document==="undefined")return;
    if(document.querySelector('script[src="'+BETA_SRC+'"]'))return;
    const script=document.createElement("script");
    script.src=BETA_SRC;
    script.defer=true;
    script.dataset.khaemenesBeta="grade-01-surface";
    (document.head||document.documentElement).appendChild(script);
  }

  function status(){
    const base=continuity()?.status?.()||{status:"unavailable",placementMatch:false,learner:null};
    const l=learner();
    return Object.freeze({
      version:VERSION,
      courseId:COURSE_ID,
      status:base.status,
      placementMatch:Boolean(base.placementMatch),
      previewAllowed:true,
      learner:l?Object.freeze({learnerId:l.learnerId,nickname:l.nickname,grade:l.grade||null,stage:l.stage||null}):null,
      authority:Object.freeze({changesPlacement:false,changesIdentity:false,awardsMastery:false,silentlyChangesGrade:false})
    });
  }

  function scopedKey(surface="general"){
    const l=learner();
    if(!l?.learnerId)return null;
    const safe=clean(surface,60).toLowerCase().replace(/[^a-z0-9-]+/g,"-").replace(/^-+|-+$/g,"")||"general";
    return `khaemenes.course:${l.learnerId}:${COURSE_ID}:${safe}`;
  }

  function render(targetId="khaemenesGrade1Context"){
    const host=document.getElementById(targetId);if(!host)return status();
    const s=status();
    host.setAttribute("data-khaemenes-grade1-context",s.status);
    host.style.cssText="margin:0 0 18px;padding:12px 14px;border:1px solid rgba(39,48,75,.14);border-left:4px solid #7158ea;border-radius:10px;background:#faf8ff;color:#3f397d;font:600 12px/1.55 system-ui,sans-serif;text-align:center";
    if(!s.learner){
      host.innerHTML='No active Academy learner is selected. This page remains available for preview. <a href="https://vervenveda.com/Khaemenes_Academy.github.io/student/">Open Student Portal</a>';
    }else if(s.placementMatch){
      host.textContent=`Active Academy learner: ${s.learner.nickname} · Grade 01 · canonical learner continuity active.`;
    }else{
      host.innerHTML=`Active learner: ${clean(s.learner.nickname,60)} · registered ${clean(s.learner.grade||"grade not set",30)} / ${clean(s.learner.stage||"stage not set",30)}. Grade 01 is in preview mode; formal placement is unchanged. <a href="https://vervenveda.com/Khaemenes_Academy.github.io/student/">Return to registered path</a>`;
    }
    return s;
  }

  function activate(surface="general",targetId="khaemenesGrade1Context"){
    ensureBetaDoorway();
    continuity()?.activate?.();
    const s=render(targetId);
    global.dispatchEvent(new CustomEvent("khaemenes-grade1-surface-ready",{detail:{...s,surface:clean(surface,60),storageKey:scopedKey(surface)}}));
    global.addEventListener("khaemenes-family-changed",()=>render(targetId));
    return s;
  }

  ensureBetaDoorway();
  global.KhaemenesGrade1SurfaceContext=Object.freeze({version:VERSION,courseId:COURSE_ID,status,scopedKey,render,activate,ensureBetaDoorway});
})(window);
