(function attachKhaemenesGrade1SubjectContext(global){"use strict";
const VERSION="1.0.0";
function registry(){return global.KhaemenesFamilyRegistry||null}
function learner(){return registry()?.getLearner?.()||null}
function ng(v){return registry()?.normalizeGrade?.(v)||String(v||"").replace(/[^0-9]/g,"").padStart(2,"0")}
function ns(v){return registry()?.normalizeStage?.(v)||String(v||"").trim().toLowerCase()}
function status(){const l=learner();if(!l)return Object.freeze({version:VERSION,status:"no-active-learner",placementMatch:false,learner:null});const ok=ng(l.grade)==="01"&&ns(l.stage)==="elementary";return Object.freeze({version:VERSION,status:ok?"ready":"placement-mismatch",placementMatch:ok,learner:Object.freeze({learnerId:l.learnerId,nickname:l.nickname,grade:l.grade||null,stage:l.stage||null}),authority:Object.freeze({changesPlacement:false,changesIdentity:false,awardsMastery:false})})}
function scopedKey(){const s=status();return s.status==="ready"?`khaemenes.course:${s.learner.learnerId}:elementary-grade-01-social-studies`:null}
function publish(){const s=status();global.dispatchEvent(new CustomEvent("khaemenes-grade1-social-studies-context",{detail:s}));return s}
global.KhaemenesGrade1SubjectContext=Object.freeze({version:VERSION,status,scopedKey,publish});
})(window);