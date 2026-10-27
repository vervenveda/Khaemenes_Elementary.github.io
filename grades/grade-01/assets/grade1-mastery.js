(function(){
  'use strict';

  const C = window.KHAEMENES_GRADE01_CURRICULUM;
  const KEY = 'khaemenes.grade01.mastery.v1';
  const THRESHOLD = (C && C.masteryThreshold) || 80;
  const $ = id => document.getElementById(id);

  function blankState(){
    return {
      weeks:{},
      notes:{},
      daily:{},
      dailyResponses:{},
      handwritingImages:{},
      workSaved:{},
      portfolio:false
    };
  }

  function normalizeState(s){
    s = s && typeof s === 'object' ? s : blankState();
    s.weeks ||= {};
    s.notes ||= {};
    s.daily ||= {};
    s.dailyResponses ||= {};
    s.handwritingImages ||= {};
    s.workSaved ||= {};
    if(typeof s.portfolio !== 'boolean') s.portfolio = !!s.portfolio;
    return s;
  }

  const ROOT_URL = 'https://vervenveda.com/Khaemenes_Elementary.github.io/grades/grade-01/';
  const CONTINUATION_URL = 'https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-learning-continuation.js';
  const REGISTRY_KEY = 'khaemenes_family_registry_v1';
  const ACTIVE_LEARNER_KEY = 'khaemenes_active_learner_v1';

  function readJSON(key,fallback=null){
    try{ const raw=localStorage.getItem(key); return raw?JSON.parse(raw):fallback; }
    catch{ return fallback; }
  }
  function academyContext(){
    const learnerId=readJSON(ACTIVE_LEARNER_KEY,null),registry=readJSON(REGISTRY_KEY,null);
    const learner=learnerId&&registry?.learners?.[learnerId] ? registry.learners[learnerId] : null;
    const grade=String(learner?.grade||'').replace(/[^0-9]/g,'').padStart(2,'0');
    const stage=String(learner?.stage||'').trim().toLowerCase();
    return {learner,match:Boolean(learner&&grade==='01'&&stage==='elementary')};
  }
  function scopedKey(){
    const ctx=academyContext();
    return ctx.match ? `khaemenes.course:${ctx.learner.learnerId}:elementary-grade-01` : null;
  }
  function scopedExists(){ const k=scopedKey(); return Boolean(k&&localStorage.getItem(k)!==null); }
  function legacyExists(){ return localStorage.getItem(KEY)!==null; }

  function load(){
    try{
      const ctx=academyContext(),k=scopedKey();
      if(ctx.learner){
        if(!ctx.match||!k) return blankState();
        const raw=localStorage.getItem(k);
        return raw ? normalizeState(JSON.parse(raw)) : blankState();
      }
      const raw=localStorage.getItem(KEY);
      return raw ? normalizeState(JSON.parse(raw)) : blankState();
    }catch(e){
      return blankState();
    }
  }

  function save(s){
    const normalized=normalizeState(s),ctx=academyContext(),k=scopedKey();
    try{
      if(ctx.learner){
        if(!ctx.match||!k) return false;
        localStorage.setItem(k,JSON.stringify(normalized));
      }else{
        localStorage.setItem(KEY,JSON.stringify(normalized));
      }
      scheduleContinuationPublish();
      return true;
    }catch{return false}
  }

  function claimLegacy(){
    const ctx=academyContext(),k=scopedKey();
    if(!ctx.match||!k||!legacyExists()) return false;
    try{
      const legacy=normalizeState(JSON.parse(localStorage.getItem(KEY)));
      if(localStorage.getItem(k)!==null) return false;
      localStorage.setItem(k,JSON.stringify(legacy));
      scheduleContinuationPublish();
      return true;
    }catch{return false}
  }
  function exportLegacy(){
    try{
      const raw=localStorage.getItem(KEY);if(!raw)return;
      const blob=new Blob([raw],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download='khaemenes-grade01-preserved-work.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }catch{}
  }
  function mountLegacyRecovery(){
    const ctx=academyContext();
    if(!ctx.match||!legacyExists()||scopedExists()||document.getElementById('learnerRecordNoticeButton')) return;
    const toolbar=document.getElementById('khaemenesLearnerUtilityToolbar');
    const button=document.createElement('button');
    button.id='learnerRecordNoticeButton';button.type='button';button.textContent='Preserved Work';
    button.style.cssText='position:fixed;right:14px;bottom:122px;z-index:2147483000;padding:8px 11px;border:1px solid #967342;border-radius:7px;background:#fff8e8;color:#20241f;font:inherit;font-size:12px;cursor:pointer';
    const panel=document.createElement('section');
    panel.id='learnerRecordNoticePanel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Preserved First Grade work');
    panel.style.cssText='position:fixed;right:14px;bottom:170px;z-index:2147483001;width:min(410px,calc(100vw - 28px));max-height:65vh;overflow:auto;padding:14px;border:1px solid #967342;border-radius:7px;background:#fff8e8;color:#20241f;box-shadow:0 14px 40px rgba(34,31,27,.24);font:inherit';
    panel.innerHTML=`<h2 style="margin:0 0 8px;font:400 24px/1.2 Georgia,serif">Preserved First Grade Work</h2><p>Older First Grade work exists on this device without a confirmed learner owner. You may export it, or deliberately copy it to <strong>${String(ctx.learner.nickname||'the active learner').replace(/[&<>"]/g,'')}</strong>. The original preserved record will remain.</p><div style="display:flex;gap:7px;flex-wrap:wrap"><button type="button" id="grade1ExportPreserved">Export preserved work</button><button type="button" id="grade1ClaimPreserved">Copy to active learner</button><button type="button" id="grade1ClosePreserved">Close</button></div>`;
    (toolbar||document.body).append(button);document.body.append(panel);
    const place=()=>{const t=document.getElementById('khaemenesLearnerUtilityToolbar');if(t&&button.parentElement!==t){button.style.position='static';button.style.order='10';t.prepend(button)}if(t){const h=Math.ceil(t.getBoundingClientRect().height||54);panel.style.bottom=`calc(max(12px, env(safe-area-inset-bottom)) + ${h+10}px)`}};
    button.onclick=()=>{panel.hidden=!panel.hidden;place()};
    panel.querySelector('#grade1ClosePreserved').onclick=()=>{panel.hidden=true;button.focus()};
    panel.querySelector('#grade1ExportPreserved').onclick=exportLegacy;
    panel.querySelector('#grade1ClaimPreserved').onclick=()=>{if(!confirm(`Copy the preserved First Grade record to ${ctx.learner.nickname||'the active learner'}? The original preserved record will remain.`))return;if(claimLegacy())location.reload()};
    place();setTimeout(place,500);setTimeout(place,1600);
  }

  let continuationTimer=0;
  function ensureContinuation(){
    if(window.KhaemenesLearningContinuation) return Promise.resolve(window.KhaemenesLearningContinuation);
    const found=[...document.scripts].find(s=>s.src===CONTINUATION_URL);
    if(found) return new Promise(resolve=>{found.addEventListener('load',()=>resolve(window.KhaemenesLearningContinuation),{once:true});setTimeout(()=>resolve(window.KhaemenesLearningContinuation),1200)});
    return new Promise(resolve=>{const s=document.createElement('script');s.src=CONTINUATION_URL;s.async=false;s.onload=()=>resolve(window.KhaemenesLearningContinuation);s.onerror=()=>resolve(null);document.head.append(s)});
  }
  function publishContinuation(){
    const ctx=academyContext(),API=window.KhaemenesLearningContinuation;if(!ctx.match||!API?.publish)return false;
    const s=load(),weeks=C?.weeks||[],completed=weeks.filter(w=>Number(s.weeks?.[w.week]?.bestScore||0)>=THRESHOLD).length;
    const midBest=Number(s.midterm?.bestScore||0),finalBest=Number(s.final?.bestScore||0);
    const midAfter=Number(C?.midterm?.unlockAfterWeek||18);
    let status='continue',nextLabel='Continue Learning',nextTitle='',nextHref='',summary='',best=null,family={needsAction:false,label:'',summary:'',href:''};
    const first=weeks.find(w=>Number(s.weeks?.[w.week]?.bestScore||0)<THRESHOLD);
    if(first&&Number(first.week)>midAfter&&completed>=midAfter&&midBest<THRESHOLD){
      best=midBest||null;status=best?'corrections':'assessment';nextLabel=best?'Review Midterm':'Open Midterm';nextTitle='First Grade Midterm';nextHref=ROOT_URL+'assessments/midterm.html';summary='Complete the midterm at 80% or higher before continuing the second half of the course.';
    }else if(first){
      best=Number(s.weeks?.[first.week]?.bestScore||0)||null;status=best?'corrections':'continue';nextLabel=best?'Review & Retry':'Continue Learning';nextTitle=`Week ${String(first.week).padStart(2,'0')}`;nextHref=best?ROOT_URL+`assessments/unit-${String(first.week).padStart(2,'0')}-assessment.html`:ROOT_URL+`lessons/unit-${String(first.week).padStart(2,'0')}/index.html`;summary=best?`Week ${String(first.week).padStart(2,'0')} best score is ${best}%. Review and retry to reach ${THRESHOLD}%.`:'Open the next First Grade lesson week.';
    }else if(midBest<THRESHOLD){
      best=midBest||null;status=best?'corrections':'assessment';nextLabel=best?'Review Midterm':'Open Midterm';nextTitle='First Grade Midterm';nextHref=ROOT_URL+'assessments/midterm.html';summary='Complete the midterm at 80% or higher.';
    }else if(finalBest<THRESHOLD){
      best=finalBest||null;status=best?'corrections':'assessment';nextLabel=best?'Review Final':'Open Final';nextTitle='First Grade Final';nextHref=ROOT_URL+'assessments/final-exam.html';summary='Complete the final assessment at 80% or higher.';
    }else if(!s.portfolio){
      status='mastery';nextLabel='Portfolio Review';nextTitle='First Grade Portfolio Evidence';nextHref=ROOT_URL+'records/certificate.html';summary='Academic mastery gates are complete. Portfolio evidence remains before certification.';family={needsAction:true,label:'Portfolio review',summary:'Review the First Grade portfolio evidence and confirm completion when the required work is present.',href:ROOT_URL+'records/certificate.html'};
    }else{
      status='complete';nextLabel='Open Certificate';nextTitle='First Grade Complete';nextHref=ROOT_URL+'records/certificate.html';summary='All First Grade completion gates are satisfied.';best=100;
    }
    try{API.publish({learnerId:ctx.learner.learnerId,courseId:'elementary-grade-01',school:'Khaemenes Elementary School',stage:'elementary',grade:'First Grade',subject:'Integrated Elementary Program',courseTitle:'Khaemenes First Grade',status,nextLabel,nextTitle,nextHref,summary,progress:{completed,total:weeks.length||36,percent:Math.round(completed/Math.max(1,weeks.length||36)*100)},mastery:{best,threshold:THRESHOLD,mastered:status==='complete'},family,source:'grade01-mastery-v1'});return true}catch{return false}
  }
  function scheduleContinuationPublish(){clearTimeout(continuationTimer);continuationTimer=setTimeout(()=>ensureContinuation().then(publishContinuation),80)}

  function pct(n,d){ return d ? Math.round((n/d)*100) : 0; }
  function masteredWeek(n){ const s=load(); return !!(s.weeks && s.weeks[n] && s.weeks[n].bestScore >= THRESHOLD); }
  function isWeekUnlocked(n){
    if(n<=1)return true;
    if(n>18&&Number(load().midterm?.bestScore||0)<THRESHOLD)return false;
    return masteredWeek(n-1);
  }
  function setText(id,val){ const el=$(id); if(el) el.textContent=val; }
  function escapeHtml(s){ return String(s??'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function weekLink(n){ return `lessons/unit-${String(n).padStart(2,'0')}/index.html`; }
  function assessLink(n){ return `assessments/unit-${String(n).padStart(2,'0')}-assessment.html`; }

  function injectInteractiveStyles(){
    if(document.getElementById('grade01StudentWorkStyles')) return;
    const style = document.createElement('style');
    style.id = 'grade01StudentWorkStyles';
    style.textContent = `
      .student-work-panel{margin-top:18px;padding:16px;border:1px solid rgba(21,54,60,.18);border-radius:16px;background:linear-gradient(180deg,#fff,#f8fbfa)}
      .student-work-panel h5{margin:0 0 8px;color:var(--navy,#172129);font-size:1.05rem}
      .student-work-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.95fr);gap:16px;align-items:stretch}
      .student-work-panel label{font-weight:800;display:block;margin:0 0 6px}
      .student-response{width:100%;min-height:180px;resize:vertical;border:1px solid rgba(21,54,60,.22);border-radius:12px;padding:12px;background:#fff;color:inherit;line-height:1.55}
      .handwriting-box{position:relative;min-height:250px;border:1.5px solid rgba(21,54,60,.35);border-radius:14px;background:#fff;overflow:hidden}
      .handwriting-guides{position:absolute;inset:0;pointer-events:none}
      .handwriting-guides:before,.handwriting-guides:after,.handwriting-guides .mid{content:"";position:absolute;left:0;right:0;border-top:1.2px solid rgba(23,33,41,.38)}
      .handwriting-guides:before{top:24%}
      .handwriting-guides .mid{top:50%;border-top:1px dashed rgba(23,33,41,.32)}
      .handwriting-guides:after{bottom:24%}
      .student-canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;display:block}
      .work-status{font-size:.88rem;color:var(--muted,#69767c);margin-top:8px}
      .work-status.saved{color:#0f6a38;font-weight:800}
      .work-actions{margin-top:10px;display:flex;gap:8px;flex-wrap:wrap}
      .work-actions button{border:1px solid rgba(21,54,60,.2);border-radius:10px;background:#fff;padding:9px 12px}
      .work-actions .primary{background:var(--gold,#e6bd4e)!important;color:#172129!important;border-color:var(--gold,#e6bd4e)!important;font-weight:900}
      .typed-preview{display:none}
      @media(max-width:760px){.student-work-grid{grid-template-columns:1fr}.handwriting-box{min-height:230px}}
      @media print{
        .student-work-panel{break-inside:avoid;background:#fff;border:1px solid #333}
        .work-actions,.work-status{display:none!important}
        .student-response{min-height:120px;border:1px solid #333}
        .handwriting-box{min-height:220px;border:1px solid #333}
      }
    `;
    document.head.appendChild(style);
  }

  function dayWorkKey(weekNum, dayNum){
    return `week-${String(weekNum).padStart(2,'0')}-day-${String(dayNum).padStart(2,'0')}`;
  }

  function renderStudentWorkPanel(key, savedText){
    return `<section class="student-work-panel" data-work-key="${escapeHtml(key)}">
      <h5>Student Work</h5>
      <p class="work-status" data-work-status="${escapeHtml(key)}">Type, write by hand, draw, label, or explain your learning. Saved work stays local in this browser.</p>
      <div class="student-work-grid">
        <div>
          <label for="typed-${escapeHtml(key)}">Type your answer or adult dictation</label>
          <textarea id="typed-${escapeHtml(key)}" class="student-response" data-work-text="${escapeHtml(key)}" placeholder="Type the student's answer, sentence, labels, or adult dictation here.">${escapeHtml(savedText||'')}</textarea>
        </div>
        <div>
          <label>Handwriting / drawing pad</label>
          <div class="handwriting-box">
            <div class="handwriting-guides"><span class="mid"></span></div>
            <canvas class="student-canvas" data-work-pad="${escapeHtml(key)}" aria-label="Handwriting and drawing pad"></canvas>
          </div>
          <div class="work-actions">
            <button type="button" class="primary" data-save-work="${escapeHtml(key)}">Save Work</button>
            <button type="button" data-clear-pad="${escapeHtml(key)}">Clear Handwriting</button>
          </div>
        </div>
      </div>
    </section>`;
  }

  const activePads = new Map();

  function setupCanvas(canvas, key){
    if(!canvas || activePads.has(canvas)) return;
    const pad = {
      canvas,
      key,
      ctx: canvas.getContext('2d'),
      drawing:false,
      dirty:false,
      loadedImage:null
    };
    activePads.set(canvas, pad);

    function resize(){
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(280, Math.round(rect.width || canvas.parentElement?.clientWidth || 420));
      const h = Math.max(220, Math.round(rect.height || canvas.parentElement?.clientHeight || 250));
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(w*dpr);
      canvas.height = Math.round(h*dpr);
      canvas.style.width = w+'px';
      canvas.style.height = h+'px';
      pad.ctx.setTransform(dpr,0,0,dpr,0,0);
      pad.ctx.lineCap = 'round';
      pad.ctx.lineJoin = 'round';
      pad.ctx.lineWidth = 4;
      pad.ctx.strokeStyle = '#172129';
      restoreImage();
    }

    function restoreImage(){
      const s = load();
      const src = s.handwritingImages && s.handwritingImages[key];
      if(!src) return;
      const img = new Image();
      img.onload = function(){
        const rect = canvas.getBoundingClientRect();
        pad.ctx.drawImage(img,0,0,rect.width,rect.height);
      };
      img.src = src;
      pad.loadedImage = src;
    }

    function point(evt){
      const rect = canvas.getBoundingClientRect();
      return {x:evt.clientX-rect.left,y:evt.clientY-rect.top};
    }

    function start(evt){
      evt.preventDefault();
      canvas.setPointerCapture?.(evt.pointerId);
      const p = point(evt);
      pad.drawing = true;
      pad.dirty = true;
      pad.ctx.beginPath();
      pad.ctx.moveTo(p.x,p.y);
    }

    function move(evt){
      if(!pad.drawing) return;
      evt.preventDefault();
      const p = point(evt);
      pad.ctx.lineTo(p.x,p.y);
      pad.ctx.stroke();
    }

    function end(evt){
      if(!pad.drawing) return;
      evt.preventDefault();
      pad.drawing = false;
      pad.ctx.closePath();
    }

    canvas.addEventListener('pointerdown', start);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    resize();
    window.addEventListener('resize', resize);
  }

  function canvasIsBlank(canvas){
    const ctx = canvas.getContext('2d');
    try{
      const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
      for(let i=3;i<data.length;i+=4){ if(data[i] !== 0) return false; }
      return true;
    }catch(e){
      return false;
    }
  }

  function saveWork(key){
    const st = load();
    st.dailyResponses ||= {};
    st.handwritingImages ||= {};
    st.workSaved ||= {};
    const text = document.querySelector(`[data-work-text="${key}"]`);
    const canvas = document.querySelector(`[data-work-pad="${key}"]`);
    if(text) st.dailyResponses[key] = text.value.trim();
    if(canvas && !canvasIsBlank(canvas)){
      st.handwritingImages[key] = canvas.toDataURL('image/png');
    }
    st.workSaved[key] = {savedAt:new Date().toISOString(), hasText:!!(text&&text.value.trim()), hasHandwriting:!!st.handwritingImages[key]};
    save(st);
    const status = document.querySelector(`[data-work-status="${key}"]`);
    if(status){
      status.textContent = 'Saved locally. Typed work and handwriting/drawing are stored only in this browser.';
      status.classList.add('saved');
    }
  }

  function clearPad(key){
    const canvas = document.querySelector(`[data-work-pad="${key}"]`);
    if(canvas){
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    const st = load();
    st.handwritingImages ||= {};
    delete st.handwritingImages[key];
    if(st.workSaved && st.workSaved[key]) st.workSaved[key].hasHandwriting = false;
    save(st);
    const status = document.querySelector(`[data-work-status="${key}"]`);
    if(status){
      status.textContent = 'Handwriting cleared locally. Press Save Work after writing again.';
      status.classList.remove('saved');
    }
  }

  function initStudentWorkPanels(){
    injectInteractiveStyles();
    document.querySelectorAll('[data-work-pad]').forEach(canvas => setupCanvas(canvas, canvas.dataset.workPad));
    document.querySelectorAll('[data-work-text]').forEach(textarea => {
      textarea.addEventListener('input', () => {
        const st = load();
        st.dailyResponses ||= {};
        st.dailyResponses[textarea.dataset.workText] = textarea.value;
        save(st);
      });
    });
    document.querySelectorAll('[data-save-work]').forEach(btn => btn.addEventListener('click', () => saveWork(btn.dataset.saveWork)));
    document.querySelectorAll('[data-clear-pad]').forEach(btn => btn.addEventListener('click', () => clearPad(btn.dataset.clearPad)));
  }

  function updateSummary(){
    if(!C) return;
    const s=load();
    const mastered=C.weeks.filter(w=>masteredWeek(w.week)).length;
    setText('masteredCount', mastered);
    setText('weekCount', C.weeks.length);
    setText('threshold', THRESHOLD+'%');
    setText('midtermScore', s.midterm?.bestScore ? s.midterm.bestScore+'%' : 'Not yet');
    setText('finalScore', s.final?.bestScore ? s.final.bestScore+'%' : 'Not yet');
    const bar=$('progressFill'); if(bar) bar.style.width=pct(mastered,C.weeks.length)+'%';
  }

  function renderDashboard(){
    if(!C) return;
    updateSummary();
    const s=load(), grid=$('weeksGrid'); if(!grid) return;
    grid.innerHTML = C.weeks.map(w => {
      const open=isWeekUnlocked(w.week), mastered=masteredWeek(w.week), rec=s.weeks[w.week];
      const score=rec?.bestScore ? `${rec.bestScore}% · ${rec.attempts||1} attempt${(rec.attempts||1)>1?'s':''}` : 'No score yet';
      const status = mastered ? 'Mastered' : open ? 'Open' : 'Locked';
      return `<article class="card span4 ${open?'':'locked'}">
        <p class="kicker">Week ${String(w.week).padStart(2,'0')} · ${status}</p>
        <h3>${escapeHtml(w.title)}</h3>
        <p>${escapeHtml(w.essentialQuestion)}</p>
        <p><strong>Mastery:</strong> ${score}</p>
        <div class="actions">
          ${open ? `<a class="button gold" href="${weekLink(w.week)}">Open Lessons</a>` : `<span class="badge">${w.week>18&&Number(s.midterm?.bestScore||0)<THRESHOLD?'Unlock by completing the Midterm at 80%.':`Unlock by mastering Week ${String(w.week-1).padStart(2,'0')}`}</span>`}
          <a class="button" href="${assessLink(w.week)}">${open?'Take Quiz':'View Gate'}</a>
        </div>
      </article>`;
    }).join('');
  }

  
  function injectLessonQualityStyles(){
    if(document.getElementById('grade01LessonQualityStyles')) return;
    const style = document.createElement('style');
    style.id = 'grade01LessonQualityStyles';
    style.textContent = `
      .sovereign-lesson{overflow:hidden}
      .lesson-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:10px}
      .lesson-day{margin:0 0 4px;text-transform:uppercase;letter-spacing:.08em;font-size:.78rem;font-weight:800;opacity:.72}
      .lesson-head h4{margin:0}
      .lesson-time{white-space:nowrap;border:1px solid rgba(21,54,60,.18);border-radius:999px;padding:6px 10px;font-size:.78rem;font-weight:800}
      .lesson-standard{margin:8px 0 16px;font-size:.9rem;opacity:.82}
      .lesson-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      .lesson-block{border:1px solid rgba(21,54,60,.12);border-radius:14px;padding:13px;background:rgba(248,251,250,.75)}
      .lesson-block h5{margin:0 0 6px;font-size:.94rem}
      .lesson-block p{margin:0;line-height:1.58}
      .lesson-block.mission{grid-column:1/-1}
      .lesson-block.challenge,.lesson-block.product,.lesson-block.check,.lesson-block.evidence,.lesson-block.reflection{background:rgba(255,255,255,.95)}
      .lesson-vocab{margin:14px 0 0;display:flex;gap:7px;align-items:center;flex-wrap:wrap}
      .lesson-vocab .badge{margin:0}
      .day-complete{display:block;margin-top:14px;font-weight:800}
      @media(max-width:760px){.lesson-grid{grid-template-columns:1fr}.lesson-block.mission{grid-column:auto}.lesson-head{flex-direction:column}}
      @media print{.lesson-grid{grid-template-columns:1fr}.lesson-block{break-inside:avoid;background:#fff}.lesson-time{display:none}}
    `;
    document.head.appendChild(style);
  }

function renderLessonPage(weekNum){
    const w=C.weeks.find(x=>x.week===weekNum); if(!w) return;
    const s=load(), open=isWeekUnlocked(weekNum);
    setText('lessonTitle', `Week ${String(weekNum).padStart(2,'0')} — ${w.title}`);
    setText('essentialQuestion', w.essentialQuestion);
    setText('literacyFocus', w.literacy); setText('mathFocus', w.math); setText('inquiryFocus', w.inquiry); setText('selFocus', w.sel); setText('projectFocus', w.project);
    const vocab=$('vocabularyList'); if(vocab) vocab.innerHTML=(w.vocabulary||[]).map(v=>`<span class="badge">${escapeHtml(v)}</span>`).join('');
    const lock=$('lockNotice');
    if(lock) lock.innerHTML = open ? '<strong>Open:</strong> Complete the daily lessons, save typed or handwritten work, then take the weekly quiz. 80% unlocks the next week.' : `<strong>Locked:</strong> Week ${String(weekNum).padStart(2,'0')} lessons unlock after Week ${String(weekNum-1).padStart(2,'0')} reaches 80% mastery. Return to the prior quiz and try again.`;
    const days=$('dailyLessons');
    if(days){
      if(!open){
        days.innerHTML = `<section class="card week-card"><h2>Lesson gate</h2><p>This week is hidden from the student route until the prior week reaches 80% mastery. Multiple tries are allowed on the prior quiz.</p><div class="actions"><a class="button gold" href="../../assessments/unit-${String(weekNum-1).padStart(2,'0')}-assessment.html">Return to Prior Quiz</a><a class="button" href="../../index.html">Grade Home</a></div></section>`;
      } else {
        days.innerHTML = (w.daily||[]).map((d,idx)=>{
          const dayNum = idx+1;
          const key=`${weekNum}-${dayNum}`, done=!!s.daily[key], workKey=dayWorkKey(weekNum, dayNum);
          const savedText = s.dailyResponses && s.dailyResponses[workKey] ? s.dailyResponses[workKey] : '';
          const hasNewLayer = !!d.miniLesson;
          return `<article class="lesson sovereign-lesson">
            <div class="lesson-head">
              <div>
                <p class="lesson-day">${escapeHtml(d.day)} · ${escapeHtml(d.focus)}</p>
                <h4>${escapeHtml(d.skill || 'Daily Learning Mission')}</h4>
              </div>
              ${d.estimatedMinutes ? `<span class="lesson-time">${escapeHtml(d.estimatedMinutes)} min</span>` : ''}
            </div>
            ${d.standard ? `<p class="lesson-standard"><strong>Alignment:</strong> ${escapeHtml(d.standard)}</p>` : ''}
            <div class="lesson-grid">
              <section class="lesson-block mission"><h5>Today's Mission</h5><p>${escapeHtml(d.objective)}</p></section>
              <section class="lesson-block"><h5>Warm-Up</h5><p>${escapeHtml(d.warmup)}</p></section>
              ${hasNewLayer ? `<section class="lesson-block"><h5>Teach</h5><p>${escapeHtml(d.miniLesson)}</p></section>
              <section class="lesson-block"><h5>Worked Example</h5><p>${escapeHtml(d.workedExample)}</p></section>
              <section class="lesson-block"><h5>Guided Practice</h5><p>${escapeHtml(d.guidedPractice)}</p></section>
              <section class="lesson-block"><h5>Independent Practice</h5><p>${escapeHtml(d.independentPractice)}</p></section>
              <section class="lesson-block challenge"><h5>Challenge</h5><p>${escapeHtml(d.challenge)}</p></section>
              <section class="lesson-block product"><h5>Student Creation</h5><p>${escapeHtml(d.studentProduct)}</p></section>
              <section class="lesson-block check"><h5>Check for Understanding</h5><p>${escapeHtml(d.checkForUnderstanding)}</p></section>
              <section class="lesson-block evidence"><h5>Mastery Evidence</h5><p>${escapeHtml(d.evidence)}</p></section>
              <section class="lesson-block"><h5>Support</h5><p>${escapeHtml(d.support)}</p></section>
              <section class="lesson-block"><h5>Extension</h5><p>${escapeHtml(d.extension)}</p></section>
              <section class="lesson-block reflection"><h5>Student Reflection</h5><p>${escapeHtml(d.reflection)}</p></section>`
              : `<section class="lesson-block"><h5>Direct Instruction</h5><p>${escapeHtml(d.directInstruction || '')}</p></section>
              <section class="lesson-block"><h5>Student Practice</h5><p>${escapeHtml(d.studentTask || '')}</p></section>
              <section class="lesson-block evidence"><h5>Mastery Evidence</h5><p>${escapeHtml(d.evidence || '')}</p></section>
              <section class="lesson-block"><h5>Support</h5><p>${escapeHtml(d.support || '')}</p></section>
              <section class="lesson-block"><h5>Extension</h5><p>${escapeHtml(d.extension || '')}</p></section>`}
            </div>
            ${d.vocabulary?.length ? `<div class="lesson-vocab"><strong>Words to use:</strong> ${d.vocabulary.map(v=>`<span class="badge">${escapeHtml(v)}</span>`).join(' ')}</div>` : ''}
            ${renderStudentWorkPanel(workKey, savedText)}
            <label class="day-complete"><input type="checkbox" data-day="${key}" ${done?'checked':''}> Mark this day complete locally</label>
          </article>`;
        }).join('');
        days.querySelectorAll('input[data-day]').forEach(cb=>cb.addEventListener('change',e=>{ const st=load(); st.daily||={}; st.daily[e.target.dataset.day]=e.target.checked; save(st); }));
        initStudentWorkPanels();
      }
    }
    const note=$('weekNote'); if(note){ note.value=s.notes[weekNum]||''; note.disabled=!open; }
    const saveNote=$('saveNote'); if(saveNote){ saveNote.disabled=!open; saveNote.addEventListener('click',()=>{ const st=load(); st.notes||={}; st.notes[weekNum]=note.value.trim(); save(st); alert('Saved locally for this browser.'); }); }
    const q=$('quizLink'); if(q) q.href=open ? `../../assessments/unit-${String(weekNum).padStart(2,'0')}-assessment.html` : `../../assessments/unit-${String(weekNum-1).padStart(2,'0')}-assessment.html`;
    const p=$('printableLink'); if(p) p.href=`../../printables/unit-${String(weekNum).padStart(2,'0')}-packet.html`;
  }

  function getAssessmentContext(){
    const page=document.body.dataset.assessment||'unit', week=Number(document.body.dataset.week||0);
    if(page==='midterm') return {kind:'midterm', title:C.midterm.title, questions:C.midterm.questions, locked:!masteredWeek(C.midterm.unlockAfterWeek), key:'midterm', unlockLabel:`Week ${String(C.midterm.unlockAfterWeek).padStart(2,'0')}`};
    if(page==='final') return {kind:'final', title:C.final.title, questions:C.final.questions, locked:!masteredWeek(C.final.unlockAfterWeek)||Number(load().midterm?.bestScore||0)<THRESHOLD, key:'final', unlockLabel:'Week 36 and Midterm'};
    const w=C.weeks.find(x=>x.week===week);
    return {kind:'unit', week, title:`Week ${String(week).padStart(2,'0')} Mastery Quiz — ${w?.title||''}`, questions:w?.quiz||[], locked:!isWeekUnlocked(week), key:String(week), unlockLabel:week<=1?'Grade Home':`Week ${String(week-1).padStart(2,'0')}`};
  }

  function renderAssessment(){
    const ctx=getAssessmentContext();
    setText('assessmentTitle', ctx.title);
    const status=$('assessmentStatus'), form=$('quizForm'), submit=$('submitQuiz'), box=$('scoreBox');
    if(status) status.innerHTML = ctx.locked ? `<strong>Locked:</strong> This assessment opens after ${ctx.unlockLabel} reaches 80% mastery. Multiple tries are allowed on the required prior quiz.` : '<strong>Open:</strong> score 80% or higher. Multiple tries allowed; best score is saved.';
    if(!form) return;
    if(ctx.locked){
      form.innerHTML = '<div class="scorebox review"><strong>Assessment gate active.</strong><br>The questions are hidden until the prerequisite mastery is complete.</div>';
      if(submit) submit.disabled=true;
      return;
    }
    form.innerHTML = (ctx.questions||[]).map((q,i)=>`<div class="quiz-item"><p><strong>${i+1}. ${escapeHtml(q.prompt)}</strong></p>${(q.choices||[]).map((c,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${escapeHtml(c)}</label>`).join('')}</div>`).join('');
    function showPrior(){
      const s=load(), rec=ctx.kind==='unit'?s.weeks[ctx.week]:s[ctx.key];
      if(rec&&box){ box.className='scorebox '+(rec.bestScore>=THRESHOLD?'mastered':'review'); box.innerHTML=`<strong>Saved best score:</strong> ${rec.bestScore}% · Attempts: ${rec.attempts||1}<br>${rec.bestScore>=THRESHOLD?'Mastery reached. Continue forward.':'Review and try again. Multiple tries are allowed.'}`; }
    }
    showPrior();
    if(submit) submit.addEventListener('click',()=>{
      let correct=0;
      (ctx.questions||[]).forEach((q,i)=>{ const chosen=form.querySelector(`input[name="q${i}"]:checked`); if(chosen && Number(chosen.value)===q.answer) correct++; });
      const score=pct(correct,(ctx.questions||[]).length), s=load(), now=new Date().toISOString();
      if(ctx.kind==='unit'){
        s.weeks||={}; const prev=s.weeks[ctx.week]||{attempts:0,bestScore:0}; const best=Math.max(prev.bestScore||0,score);
        s.weeks[ctx.week]={latestScore:score,bestScore:best,attempts:(prev.attempts||0)+1,mastered:best>=THRESHOLD,completedAt:now};
      }else{
        const prev=s[ctx.key]||{attempts:0,bestScore:0}; const best=Math.max(prev.bestScore||0,score);
        s[ctx.key]={latestScore:score,bestScore:best,attempts:(prev.attempts||0)+1,mastered:best>=THRESHOLD,completedAt:now};
      }
      save(s); showPrior(); if(box) box.scrollIntoView({behavior:'smooth',block:'center'});
    });
  }

  function renderWeeklyAssessmentIndex(){
    const h=$('assessmentList'); if(!h || !C) return;
    h.innerHTML=C.weeks.map(w=>{ const open=isWeekUnlocked(w.week), m=masteredWeek(w.week); return `<article class="card span4 ${open?'':'locked'}"><p class="kicker">Week ${String(w.week).padStart(2,'0')} ${m?'· Mastered':open?'· Open':'· Locked'}</p><h3>${escapeHtml(w.title)}</h3><p>${escapeHtml(w.essentialQuestion)}</p><a class="button gold" href="unit-${String(w.week).padStart(2,'0')}-assessment.html">Open Weekly Quiz</a></article>`; }).join('');
  }

  function renderCertificate(){
    updateSummary();
    const s=load(), mastered=C.weeks.filter(w=>masteredWeek(w.week)).length, mid=s.midterm?.bestScore||0, fin=s.final?.bestScore||0, portfolio=!!s.portfolio;
    const eligible=mastered===C.weeks.length && mid>=THRESHOLD && fin>=THRESHOLD && portfolio;
    const status=$('certificateStatus');
    if(status){ status.className='scorebox '+(eligible?'mastered':'review'); status.innerHTML=eligible?'<strong>Certificate unlocked.</strong> Print this page for records.':`<strong>Certificate locked.</strong><br>Weeks mastered: ${mastered}/${C.weeks.length}<br>Midterm: ${mid||'Not yet'}%<br>Final: ${fin||'Not yet'}%<br>Portfolio marked complete: ${portfolio?'Yes':'No'}`; }
    const cb=$('portfolioComplete'); if(cb){ cb.checked=portfolio; cb.addEventListener('change',e=>{ const st=load(); st.portfolio=e.target.checked; save(st); location.reload(); }); }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{mountLegacyRecovery();scheduleContinuationPublish()},{once:true});
  else {mountLegacyRecovery();scheduleContinuationPublish()}
  window.addEventListener('khaemenes-learning-continuation-ready',publishContinuation);
  window.Grade1Mastery={renderDashboard,renderLessonPage,renderAssessment,renderWeeklyAssessmentIndex,renderCertificate,updateSummary,load,save,claimLegacy,publishContinuation};
})();
