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

  function load(){
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw) return blankState();
      return normalizeState(JSON.parse(raw));
    }catch(e){
      return blankState();
    }
  }

  function save(s){
    localStorage.setItem(KEY, JSON.stringify(normalizeState(s)));
  }

  function pct(n,d){ return d ? Math.round((n/d)*100) : 0; }
  function masteredWeek(n){ const s=load(); return !!(s.weeks && s.weeks[n] && s.weeks[n].bestScore >= THRESHOLD); }
  function isWeekUnlocked(n){ return n<=1 || masteredWeek(n-1); }
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
          ${open ? `<a class="button gold" href="${weekLink(w.week)}">Open Lessons</a>` : `<span class="badge">Unlock by mastering Week ${String(w.week-1).padStart(2,'0')}</span>`}
          <a class="button" href="${assessLink(w.week)}">${open?'Take Quiz':'View Gate'}</a>
        </div>
      </article>`;
    }).join('');
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
          return `<article class="lesson">
            <h4>${escapeHtml(d.day)}: ${escapeHtml(d.focus)}</h4>
            <p><strong>Objective:</strong> ${escapeHtml(d.objective)}</p>
            <p><strong>Warm-up:</strong> ${escapeHtml(d.warmup)}</p>
            <p><strong>Direct instruction:</strong> ${escapeHtml(d.directInstruction)}</p>
            <p><strong>Teacher/adult script:</strong> ${escapeHtml(d.teacherScript)}</p>
            <p><strong>Student practice:</strong> ${escapeHtml(d.studentTask)}</p>
            <p><strong>Evidence:</strong> ${escapeHtml(d.evidence)}</p>
            <p><strong>Support:</strong> ${escapeHtml(d.support)}</p>
            <p><strong>Extension:</strong> ${escapeHtml(d.extension)}</p>
            ${renderStudentWorkPanel(workKey, savedText)}
            <label style="display:block;margin-top:14px"><input type="checkbox" data-day="${key}" ${done?'checked':''}> Mark this day complete locally</label>
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
    if(page==='final') return {kind:'final', title:C.final.title, questions:C.final.questions, locked:!masteredWeek(C.final.unlockAfterWeek), key:'final', unlockLabel:`Week ${String(C.final.unlockAfterWeek).padStart(2,'0')}`};
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

  window.Grade1Mastery={renderDashboard,renderLessonPage,renderAssessment,renderWeeklyAssessmentIndex,renderCertificate,updateSummary,load,save};
})();
