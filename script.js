// ===== SIMPLE SETTINGS =====
// Your official BrightPath Financial Facebook Page username
// Messenger link: https://m.me/BrightPathByCristina
const messengerTarget = "BrightPathByCristina";

// Google Sheets lead capture web app URL
const leadCaptureUrl = "https://script.google.com/macros/s/AKfycbyUFWZRMzG1jjqGhDiPur2jlKrjJzk4KYZ3er5cpjyVftf8zq8_36IFh-z70O6sZiRQrQ/exec";

const areas = {
  hospitalization: "Hospitalization Protection",
  critical: "Critical Illness Protection",
  family: "Family Income Protection",
  employer: "Employer Benefits",
  emergency: "Emergency Fund"
};

const questions = [
  {area:"hospitalization", q:"If you were admitted to the hospital tomorrow, how clear are you about who pays the bill?", a:[ ["I know what my HMO/insurance covers",10], ["I have some idea",7], ["I am not sure",3], ["I would rely on savings",1] ]},
  {area:"hospitalization", q:"If your hospital bill reached ₱1,000,000, what would likely happen?", a:[ ["I have protection prepared",10], ["I can cover part of it",6], ["I would need to borrow",2], ["I honestly do not know",1] ]},
  {area:"critical", q:"If you were diagnosed with a critical illness, what worries you most?", a:[ ["I already have critical illness coverage",10], ["Hospital bills only",6], ["Losing my income",3], ["Everything worries me",1] ]},
  {area:"critical", q:"If you could not work for one year while recovering, how would your family cope?", a:[ ["We would be okay",10], ["We would struggle but manage",6], ["We would borrow money",2], ["I do not know",1] ]},
  {area:"family", q:"If something happened to you, would your family have money for monthly expenses?", a:[ ["Yes, already planned",10], ["Maybe for a few months",6], ["Not enough",2], ["I have not thought about it",1] ]},
  {area:"family", q:"Do your beneficiaries know where to find your policy information?", a:[ ["Yes",10], ["Some of them know",6], ["No",2], ["I do not have a policy",1] ]},
  {area:"employer", q:"If you resigned tomorrow, would your current insurance continue?", a:[ ["Yes, because I own my policy",10], ["Partly",6], ["No, it is mostly employer-based",2], ["I am not sure",1] ]},
  {area:"emergency", q:"How many months of expenses can your emergency fund cover?", a:[ ["6 months or more",10], ["3 to 5 months",8], ["1 to 2 months",4], ["Less than 1 month",1] ]},
  {area:"emergency", q:"How confident are you that your family would remain stable after an unexpected event?", a:[ ["Very confident",10], ["Somewhat confident",7], ["Not very confident",3], ["I honestly do not know",1] ]}
];

let current = 0;
let selected = Array(questions.length).fill(null);

const $ = id => document.getElementById(id);
function hideAll(){["introScreen","profileScreen","quizScreen","resultScreen"].forEach(id=>$(id).classList.add("hidden"));}
function showIntro(){hideAll();$("introScreen").classList.remove("hidden");}
function startProfile(){hideAll();$("profileScreen").classList.remove("hidden");}
function startQuiz(){hideAll();$("quizScreen").classList.remove("hidden");renderQuestion();}
function renderQuestion(){
  const q=questions[current];
  $("questionCount").textContent=`Question ${current+1} of ${questions.length}`;
  const pct=Math.round((current/questions.length)*100);$("percentText").textContent=`${pct}% complete`;$("progressFill").style.width=`${pct}%`;
  $("questionText").textContent=q.q;$("answers").innerHTML="";
  q.a.forEach((ans,i)=>{const d=document.createElement("div");d.className="answer"+(selected[current]===i?" selected":"");d.textContent=ans[0];d.onclick=()=>{selected[current]=i;renderQuestion();$("nextBtn").disabled=false};$("answers").appendChild(d);});
  $("nextBtn").disabled=selected[current]===null;$("nextBtn").textContent=current===questions.length-1?"See My Score →":"Next →";
}
function nextQuestion(){ if(current<questions.length-1){current++;renderQuestion()}else showResults(); }
function prevQuestion(){ if(current>0){current--;renderQuestion()}else startProfile(); }
function scoreData(){
  const totals={hospitalization:0,critical:0,family:0,employer:0,emergency:0};
  const max={hospitalization:0,critical:0,family:0,employer:0,emergency:0};
  questions.forEach((q,i)=>{totals[q.area]+=q.a[selected[i]][1];max[q.area]+=10;});
  const areaScores={};Object.keys(totals).forEach(k=>areaScores[k]=Math.round((totals[k]/max[k])*100));
  const overall=Math.round(Object.values(totals).reduce((a,b)=>a+b,0)/(questions.length*10)*100);
  return {overall, areaScores};
}
function showResults(){
  hideAll();$("resultScreen").classList.remove("hidden");$("progressFill").style.width="100%";
  const {overall,areaScores}=scoreData();
  const strongest=Object.keys(areaScores).sort((a,b)=>areaScores[b]-areaScores[a])[0];
  const weakest=Object.keys(areaScores).sort((a,b)=>areaScores[a]-areaScores[b])[0];
  $("scoreNumber").textContent=overall;
  $("scoreLabel").textContent=overall>=85?"Strong Protection Foundation":overall>=70?"Good Foundation":overall>=50?"Needs Attention":"High Risk Gap";
  $("strongestArea").textContent=areas[strongest];$("biggestGap").textContent=areas[weakest];
  $("breakdown").innerHTML=Object.keys(areaScores).map(k=>`<div class="bar-row"><div class="bar-label"><span>${areas[k]}</span><span>${areaScores[k]}%</span></div><div class="bar"><div style="width:${areaScores[k]}%"></div></div></div>`).join("");
  const name=$("clientName").value.trim()||"a prospective client";
  const age=$("clientAge").value.trim();
  const email=$("clientEmail").value.trim();
  const mobile=$("clientMobile").value.trim();
  const work=$("clientWork").value;

  saveLead({
    name,
    email,
    mobile,
    age,
    employment: work,
    score: overall,
    strongestArea: areas[strongest],
    biggestGap: areas[weakest],
    consultationRequested: "Pending / Messenger button shown"
  });

  const msg=`Hi Cristina! 😊%0A%0AMy name is ${encodeURIComponent(name)}.${age?`%0AAge: ${encodeURIComponent(age)}`:""}%0AEmployment: ${encodeURIComponent(work)}%0A%0AI completed your Financial Protection Score assessment.%0A%0A📊 Score: ${overall}/100%0A✅ Strongest Area: ${encodeURIComponent(areas[strongest])}%0A⚠️ Biggest Gap: ${encodeURIComponent(areas[weakest])}%0A%0AI'd like to schedule my FREE Financial Protection Review.`;
  $("messengerBtn").href=`https://m.me/${messengerTarget}?text=${msg}`;
}

function saveLead(data){
  if(!leadCaptureUrl || leadCaptureUrl.includes("PASTE")) return;
  const payload = JSON.stringify(data);
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], {type: "text/plain;charset=UTF-8"});
      navigator.sendBeacon(leadCaptureUrl, blob);
      return;
    }
    fetch(leadCaptureUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {"Content-Type": "text/plain;charset=UTF-8"},
      body: payload
    }).catch(() => {});
  } catch (err) {
    console.warn("Lead capture did not complete", err);
  }
}
function resetQuiz(){current=0;selected=Array(questions.length).fill(null);showIntro();}
