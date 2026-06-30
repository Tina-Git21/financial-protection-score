const questions = [
  { category: "Hospitalization", text: "If you were admitted to the hospital tomorrow, how confident are you about who would pay the bill?", area: "Hospitalization", answers: [
    ["I know exactly what my HMO/insurance covers.", 10], ["I have some idea, but I’m not fully sure.", 7], ["I’m not sure.", 3], ["I would probably use savings or borrow.", 0]
  ]},
  { category: "Hospitalization", text: "If your hospital bill reached ₱1,000,000, what would most likely happen?", area: "Hospitalization", answers: [
    ["I already have protection for this.", 10], ["I have some coverage, but may still pay a lot.", 7], ["I’d use savings.", 4], ["I’d need to borrow or ask help from family.", 0]
  ]},
  { category: "Critical Illness", text: "If you were diagnosed with a serious illness, what concerns you most?", area: "Critical Illness", answers: [
    ["I have a plan for treatment and income replacement.", 10], ["Hospital bills.", 6], ["Losing income while recovering.", 3], ["I honestly don’t know what we would do.", 0]
  ]},
  { category: "Critical Illness", text: "If you could not work for one year because of illness, how would your family cope financially?", area: "Critical Illness", answers: [
    ["We would be okay.", 10], ["We would struggle but manage.", 6], ["We would need to borrow.", 2], ["I don’t know.", 0]
  ]},
  { category: "Family Protection", text: "If something happened to you, how prepared would your family be for monthly expenses?", area: "Family Protection", answers: [
    ["They would be financially prepared.", 10], ["They would be okay for a few months.", 7], ["They would struggle quickly.", 3], ["I have not planned for this yet.", 0]
  ]},
  { category: "Family Protection", text: "Do your beneficiaries know where to find your insurance details and important documents?", area: "Family Protection", answers: [
    ["Yes, everything is organized.", 10], ["Somewhat.", 6], ["Not really.", 2], ["I haven’t thought about this.", 0]
  ]},
  { category: "Employer Benefits", text: "If you resigned or changed jobs tomorrow, would your current insurance protection continue?", area: "Employer Benefits", answers: [
    ["Yes, because I personally own my coverage.", 10], ["Some of it would continue.", 7], ["No, most is from work.", 3], ["I’m not sure.", 0]
  ]},
  { category: "Emergency Fund", text: "How many months of expenses can your emergency fund cover?", area: "Emergency Fund", answers: [
    ["6 months or more.", 10], ["3–5 months.", 7], ["1–2 months.", 4], ["Less than 1 month.", 0]
  ]},
  { category: "Insurance Clarity", text: "Do you know the difference between HMO, life insurance, and critical illness insurance?", area: "Insurance Clarity", answers: [
    ["Yes, clearly.", 10], ["Somewhat.", 7], ["Not really.", 3], ["No, I get confused.", 0]
  ]},
  { category: "Insurance Clarity", text: "When was the last time you reviewed your financial protection plan?", area: "Insurance Clarity", answers: [
    ["Within the last 12 months.", 10], ["1–2 years ago.", 7], ["More than 2 years ago.", 3], ["Never.", 0]
  ]}
];

let current = 0;
let selected = [];

function startQuiz() {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("quizScreen").classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  const q = questions[current];
  document.getElementById("questionCount").textContent = `Question ${current + 1} of ${questions.length}`;
  document.getElementById("categoryText").textContent = q.category;
  document.getElementById("questionText").textContent = q.text;
  document.getElementById("progressFill").style.width = `${(current / questions.length) * 100}%`;

  const answers = document.getElementById("answers");
  answers.innerHTML = "";
  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = answer[0];
    button.onclick = () => selectAnswer(index);
    answers.appendChild(button);
  });
}

function selectAnswer(index) {
  selected[current] = index;
  if (current < questions.length - 1) {
    current++;
    showQuestion();
  } else {
    showResult();
  }
}

function previousQuestion() {
  if (current === 0) {
    document.getElementById("quizScreen").classList.add("hidden");
    document.getElementById("startScreen").classList.remove("hidden");
    return;
  }
  current--;
  showQuestion();
}

function showResult() {
  document.getElementById("quizScreen").classList.add("hidden");
  document.getElementById("resultScreen").classList.remove("hidden");

  const areaScores = {};
  const areaCounts = {};
  let total = 0;

  questions.forEach((q, i) => {
    const points = q.answers[selected[i]][1];
    total += points;
    areaScores[q.area] = (areaScores[q.area] || 0) + points;
    areaCounts[q.area] = (areaCounts[q.area] || 0) + 1;
  });

  const score = Math.round(total);
  document.getElementById("finalScore").textContent = score;
  document.querySelector(".score-number").style.setProperty("--score", `${score}%`);

  let label = "Needs Attention";
  let message = "Your answers suggest there may be important protection gaps worth reviewing soon.";
  if (score >= 85) { label = "Strong Protection Foundation"; message = "You appear to have a strong foundation, but it is still wise to review your coverage regularly."; }
  else if (score >= 70) { label = "Good Foundation"; message = "You have many good pieces in place, but a few gaps may still affect your family during emergencies."; }
  else if (score >= 45) { label = "Needs Review"; message = "You may have some protection, but your answers suggest your safety net may not be complete yet."; }

  document.getElementById("scoreLabel").textContent = label;
  document.getElementById("scoreMessage").textContent = message;

  const areaPercents = Object.keys(areaScores).map(area => ({
    area,
    percent: Math.round((areaScores[area] / (areaCounts[area] * 10)) * 100)
  }));

  areaPercents.sort((a, b) => b.percent - a.percent);
  document.getElementById("strongestArea").textContent = areaPercents[0].area;
  document.getElementById("biggestGap").textContent = areaPercents[areaPercents.length - 1].area;

  const breakdown = document.getElementById("breakdown");
  breakdown.innerHTML = "";
  areaPercents.forEach(item => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <strong>${item.area}</strong>
      <div class="bar-track"><div class="bar-fill" style="width:${item.percent}%"></div></div>
      <span>${item.percent}%</span>
    `;
    breakdown.appendChild(row);
  });

  const gap = areaPercents[areaPercents.length - 1].area;
  const strongest = areaPercents[0].area;
  const plainMessage = `Hi Cristina! I completed the Financial Protection Score assessment. My score is ${score}/100. My strongest area is ${strongest}, and my biggest gap appears to be ${gap}. I'd like to book a free consultation.`;

  const messengerLink = document.getElementById("messengerLink");
  messengerLink.href = `https://m.me/BrightPathByCristina?text=${encodeURIComponent(plainMessage)}`;
  messengerLink.textContent = "Message Cristina with My Score";
  messengerLink.onclick = async () => {
    try {
      await navigator.clipboard.writeText(plainMessage);
      alert("Your result message was copied. Messenger will open next — just paste/send it to Cristina.");
    } catch (error) {
      // Messenger will still open even if clipboard permission is blocked.
    }
  };
}

function retakeQuiz() {
  current = 0;
  selected = [];
  document.getElementById("resultScreen").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
}
