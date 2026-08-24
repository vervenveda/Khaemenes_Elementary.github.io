(function(){
  'use strict';
  const C = window.KHAEMENES_GRADE01_CURRICULUM;
  const KEY = 'khaemenes.grade01.mastery.v1';
  const THRESHOLD = (C && C.masteryThreshold) || 80;
  const $ = id => document.getElementById(id);
  function load(){
    try{ const raw=localStorage.getItem(KEY); if(!raw) return {weeks:{},notes:{},daily:{},portfolio:false}; const s=JSON.parse(raw); s.weeks||={}; s.notes||={}; s.daily||={}; return s; }
    catch(e){ return {weeks:{},notes:{},daily:{},portfolio:false}; }
  }
  function save(s){ localStorage.setItem(KEY, JSON.stringify(s)); }
  function pct(n,d){ return d ? Math.round((n/d)*100) : 0; }
  function masteredWeek(n){ const s=load(); return !!(s.weeks && s.weeks[n] && s.weeks[n].bestScore >= THRESHOLD); }
  function isWeekUnlocked(n){ return n<=1 || masteredWeek(n-1); }
  function setText(id,val){ const el=$(id); if(el) el.textContent=val; }
  function escapeHtml(s){ return String(s??'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function weekLink(n){ return `lessons/unit-${String(n).padStart(2,'0')}/index.html`; }
  function assessLink(n){ return `assessments/unit-${String(n).padStart(2,'0')}-assessment.html`; }

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
    const vocab=$('vocabularyList'); if(vocab) vocab.innerHTML=w.vocabulary.map(v=>`<span class="badge">${escapeHtml(v)}</span>`).join('');
    const lock=$('lockNotice');
    if(lock) lock.innerHTML = open ? '<strong>Open:</strong> Complete the daily lessons, then take the weekly quiz. 80% unlocks the next week.' : `<strong>Locked:</strong> Week ${String(weekNum).padStart(2,'0')} lessons unlock after Week ${String(weekNum-1).padStart(2,'0')} reaches 80% mastery. Return to the prior quiz and try again.`;
    const days=$('dailyLessons');
    if(days){
      if(!open){
        days.innerHTML = `<section class="card week-card"><h2>Lesson gate</h2><p>This week is hidden from the student route until the prior week reaches 80% mastery. Multiple tries are allowed on the prior quiz.</p><div class="actions"><a class="button gold" href="../../assessments/unit-${String(weekNum-1).padStart(2,'0')}-assessment.html">Return to Prior Quiz</a><a class="button" href="../../index.html">Grade Home</a></div></section>`;
      } else {
        days.innerHTML = w.daily.map((d,idx)=>{
          const key=`${weekNum}-${idx+1}`, done=!!s.daily[key];
          return `<article class="lesson"><h4>${escapeHtml(d.day)}: ${escapeHtml(d.focus)}</h4><p><strong>Objective:</strong> ${escapeHtml(d.objective)}</p><p><strong>Warm-up:</strong> ${escapeHtml(d.warmup)}</p><p><strong>Direct instruction:</strong> ${escapeHtml(d.directInstruction)}</p><p><strong>Teacher/adult script:</strong> ${escapeHtml(d.teacherScript)}</p><p><strong>Student practice:</strong> ${escapeHtml(d.studentTask)}</p><p><strong>Evidence:</strong> ${escapeHtml(d.evidence)}</p><p><strong>Support:</strong> ${escapeHtml(d.support)}</p><p><strong>Extension:</strong> ${escapeHtml(d.extension)}</p><label><input type="checkbox" data-day="${key}" ${done?'checked':''}> Mark this day complete locally</label></article>`;
        }).join('');
        days.querySelectorAll('input[data-day]').forEach(cb=>cb.addEventListener('change',e=>{ const st=load(); st.daily||={}; st.daily[e.target.dataset.day]=e.target.checked; save(st); }));
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
    form.innerHTML = ctx.questions.map((q,i)=>`<div class="quiz-item"><p><strong>${i+1}. ${escapeHtml(q.prompt)}</strong></p>${q.choices.map((c,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${escapeHtml(c)}</label>`).join('')}</div>`).join('');
    function showPrior(){
      const s=load(), rec=ctx.kind==='unit'?s.weeks[ctx.week]:s[ctx.key];
      if(rec&&box){ box.className='scorebox '+(rec.bestScore>=THRESHOLD?'mastered':'review'); box.innerHTML=`<strong>Saved best score:</strong> ${rec.bestScore}% · Attempts: ${rec.attempts||1}<br>${rec.bestScore>=THRESHOLD?'Mastery reached. Continue forward.':'Review and try again. Multiple tries are allowed.'}`; }
    }
    showPrior();
    if(submit) submit.addEventListener('click',()=>{
      let correct=0;
      ctx.questions.forEach((q,i)=>{ const chosen=form.querySelector(`input[name="q${i}"]:checked`); if(chosen && Number(chosen.value)===q.answer) correct++; });
      const score=pct(correct,ctx.questions.length), s=load(), now=new Date().toISOString();
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
    const h=$('assessmentList'); if(!h) return;
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
