const messengerLink = "https://m.me/plukmariacristinainocencio?ref=FinancialProtectionScore"; // Change this to your exact Facebook page Messenger link if needed.

const questions = [
  {cat:"Hospitalization", q:"If you were admitted to the hospital tomorrow, who would most likely pay the bill?", a:[
    ["I know exactly what my HMO and insurance cover",10], ["My HMO, but I'm not sure about the limit",6], ["My savings or family",3], ["I honestly don't know",0]]},
  {cat:"Hospitalization", q:"If your hospital bill reached ₱1,000,000, how prepared are you?", a:[
    ["I have a clear plan and coverage",10], ["I have some protection but I'm unsure if enough",6], ["I would probably borrow or ask for help",2], ["I have no idea",0]]},
  {cat:"Critical Illness", q:"If you were diagnosed with cancer or another critical illness, what worries you most?", a:[
    ["I already have critical illness coverage",10], ["Hospital bills",6], ["Lost income and family expenses",3], ["Everything — I don't have a plan",0]]},
  {cat:"Critical Illness", q:"If you could not work for one year while recovering, what would happen financially?", a:[
    ["My family would still be okay",10], ["We would struggle but survive",6], ["We would need to borrow",2], ["I don't know",0]]},
  {cat:"Life Protection", q:"If something happened to you, would your family have enough money for monthly expenses and debts?", a:[
    ["Yes, I have enough life insurance",10], ["Maybe, but I haven't computed it",6], ["Only for a short time",3], ["No / I don't know",0]]},
  {cat:"Life Protection", q:"Do your beneficiaries know about your policies and where to find them?", a:[
    ["Yes, everything is organized",10], ["They know I have insurance but not all details",6], ["Only I know the details",3], ["I don't have policies / not sure",0]]},
  {cat:"Employer Benefits", q:"If you resigned tomorrow, would your current insurance protection continue?", a:[
    ["Yes, because I personally own my plan",10], ["Some benefits might continue",6], ["No, most of it is from work",2], ["I'm not sure",0]]},
  {cat:"Employer Benefits", q:"Do you know the difference between HMO, company benefits, life insurance, and critical illness insurance?", a:[
    ["Yes, I understand the differences",10], ["Somewhat",6], ["Not really",2], ["No",0]]},
  {cat:"Emergency Fund", q:"How many months of expenses can your emergency fund cover?", a:[
    ["6 months or more",10], ["3–5 months",7], ["1–2 months",4], ["Less than 1 month / none",0]]},
  {cat:"Emergency Fund", q:"When was the last time you reviewed your financial protection plan?", a:[
    ["Within the last 12 months",10], ["1–2 years ago",6], ["More than 2 years ago",3], ["Never",0]]}
];

let current = 0; let answers = [];
function startQuiz(){document.getElementById('startScreen').classList.add('hidden');document.getElementById('quizScreen').classList.remove('hidden');renderQuestion();}
function renderQuestion(){const item=questions[current];document.getElementById('questionCount').textContent=`Question ${current+1} of ${questions.length}`;let pct=Math.round((current/questions.length)*100);document.getElementById('percentText').textContent=`${pct}% complete`;document.getElementById('progressFill').style.width=`${pct}%`;document.getElementById('questionText').textContent=item.q;const box=document.getElementById('answerOptions');box.innerHTML='';item.a.forEach((ans)=>{const b=document.createElement('button');b.className='option';b.textContent=ans[0];b.onclick=()=>selectAnswer(ans[1]);box.appendChild(b);});}
function selectAnswer(score){answers[current]=score;if(current<questions.length-1){current++;renderQuestion();}else{showResults();}}
function prevQuestion(){if(current>0){current--;renderQuestion();}else{document.getElementById('quizScreen').classList.add('hidden');document.getElementById('startScreen').classList.remove('hidden');}}
function showResults(){document.getElementById('quizScreen').classList.add('hidden');document.getElementById('resultScreen').classList.remove('hidden');document.getElementById('progressFill').style.width='100%';const total=answers.reduce((a,b)=>a+b,0);const score=Math.round((total/(questions.length*10))*100);document.getElementById('finalScore').textContent=score;let title,msg;if(score>=85){title='Excellent Protection Awareness';msg='You appear to have a strong foundation, but it is still wise to review your coverage as your life changes.';}else if(score>=65){title='Good Foundation';msg='You have a good start, but your answers suggest there may be protection gaps worth checking.';}else if(score>=40){title='Needs Attention';msg='Your answers suggest that some areas of your financial protection may leave you or your family exposed.';}else{title='High Risk';msg='Your financial protection may not be as clear or complete as you think. The good news is that this can be improved step by step.';}document.getElementById('scoreTitle').textContent=title;document.getElementById('scoreMessage').textContent=msg;
const catScores={};questions.forEach((q,i)=>{if(!catScores[q.cat])catScores[q.cat]=[];catScores[q.cat].push(answers[i]||0);});const averages=Object.entries(catScores).map(([cat,arr])=>[cat,Math.round(arr.reduce((a,b)=>a+b,0)/(arr.length*10)*100)]);averages.sort((a,b)=>b[1]-a[1]);document.getElementById('strongestArea').textContent=`${averages[0][0]} (${averages[0][1]}%)`;document.getElementById('weakestArea').textContent=`${averages[averages.length-1][0]} (${averages[averages.length-1][1]}%)`;
const breakdown=document.getElementById('breakdown');breakdown.innerHTML='';averages.forEach(([cat,val])=>{breakdown.innerHTML+=`<div class="barWrap"><div class="barTop"><strong>${cat}</strong><span>${val}%</span></div><div class="bar"><div style="width:${val}%"></div></div></div>`;});document.getElementById('messengerBtn').href=messengerLink;}
function restartQuiz(){current=0;answers=[];document.getElementById('resultScreen').classList.add('hidden');document.getElementById('startScreen').classList.remove('hidden');}
