// --- script.js (cleaned + fixes) ---
let currentUser = null;
let users = JSON.parse(localStorage.getItem("users")) || {};

// session id to cancel previous quizzes when switching lessons/pages
let quizSessionId = 0;

// Registration/Login
function showRegister(){
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.remove("hidden");
  // small animation reset
  animateCard(document.getElementById("registerForm"));
}
function showLogin(){
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
  animateCard(document.getElementById("loginForm"));
}
function togglePassword(){
  const pwd=document.getElementById("loginPassword");
  pwd.type=pwd.type==='password'?'text':'password';
}

function register(){
  const fullName=document.getElementById("regFullName").value.trim();
  const username=document.getElementById("regUsername").value.trim();
  const password=document.getElementById("regPassword").value;
  if(!fullName || !username || !password){
    alert("Please fill all registration fields.");
    return;
  }
  if(users[username]){
    alert("Username exists!");
    return;
  }
  users[username] = {
    fullName,
    password,
    lessonsCompleted: 0,
    scores: [],
    certificates: [],
    badges: [],
    completions: {}
  };
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registration success!");
  showLogin();
}

function login(){
  const username=document.getElementById("loginUsername").value.trim();
  const password=document.getElementById("loginPassword").value;
  if(users[username] && users[username].password===password){
    currentUser=username;
    if(document.getElementById("rememberMe").checked){
      localStorage.setItem("rememberedUser",username);
    } else {
      localStorage.removeItem("rememberedUser");
    }
    document.getElementById("authPage").classList.add("hidden");
    document.getElementById("homePage").classList.remove("hidden");
    document.getElementById("studentName").innerText=users[username].fullName;
  } else {
    alert("Invalid credentials");
  }
}

function logout(){
  currentUser=null;
  document.getElementById("homePage").classList.add("hidden");
  document.getElementById("authPage").classList.remove("hidden");
  document.getElementById("loginUsername").value="";
  document.getElementById("loginPassword").value="";
  document.getElementById("rememberMe").checked=false;
  // cancel any active quiz
  quizSessionId++;
}

// Subjects
function openSubject(subject){
  // cancel any active quiz and start fresh session
  quizSessionId++;
  document.getElementById("homePage").classList.add("hidden");
  document.getElementById("lessonPage").classList.remove("hidden");
  document.getElementById("lessonTitle").innerText=subject+" Lessons";
  showLessonContent(subject);
  // clear any quiz UI leftover
  document.getElementById("quizContainer").innerHTML = "";
}

function goHome(){
  // cancel active quiz
  quizSessionId++;
  document.getElementById("lessonPage").classList.add("hidden");
  document.getElementById("profilePage").classList.add("hidden");
  document.getElementById("certificatePage").classList.add("hidden");
  document.getElementById("homePage").classList.remove("hidden");
  // clear UI
  document.getElementById("quizContainer").innerHTML = "";
}

// Lessons per subject
const lessonsContent = {
  Math:["Addition","Subtraction","Multiplication","Division"],
  Science:["Circulatory","Respiratory","Digestive","Nervous","Skeletal/Muscular"]
};

function showLessonContent(subject){
  const container=document.getElementById("lessonContent");
  container.innerHTML="<h3>Lessons:</h3>";
  lessonsContent[subject].forEach(lesson=>{
    const btn=document.createElement("button");
    btn.className = "lesson-btn";
    btn.innerText=lesson;
    btn.onclick=()=>startQuiz(subject,lesson);
    container.appendChild(btn);
  });
}

// Question Pools
function generateQuestionPool(subject,lesson){
  const questions=[];
  if(subject==="Math"){
    for(let i=0;i<200;i++){
      let a=Math.floor(Math.random()*50)+1;
      let b=Math.floor(Math.random()*50)+1;
      let q, ans;
      if(lesson==="Addition"){q=`${a} + ${b} = ?`; ans=a+b;}
      if(lesson==="Subtraction"){q=`${a+b} - ${b} = ?`; ans=a;}
      if(lesson==="Multiplication"){q=`${a} × ${b} = ?`; ans=a*b;}
      if(lesson==="Division"){q=`${a*b} ÷ ${b} = ?`; ans=a;}
      questions.push({q,a:ans,choices:shuffle([ans,ans+1,ans-1,ans+2])});
    }
  } else if(subject==="Science"){
    const scienceQuestions = generateScienceQuestions(lesson,20); // added more questions
    questions.push(...scienceQuestions);
  }
  return questions;
}

function generateScienceQuestions(topic,count){
  const qs=[];
  for(let i=0;i<count;i++){
    let q,a;
    // (same content as before) - keep questions same
    if(topic==="Circulatory"){q=`What organ pumps blood throughout the body?`; a="Heart"; qs.push({q,a,choices:shuffle([a,"Liver","Lungs","Brain","Kidney"])});}
    if(topic==="Circulatory"){q=`Which vessels carry blood away from the heart?`; a="Arteries"; qs.push({q,a,choices:shuffle([a,"Veins","Capillaries","Nerves","Tendons"])});}
    if(topic==="Circulatory"){q=`Which vessels bring blood back to the heart?`; a="Veins"; qs.push({q,a,choices:shuffle([a,"Arteries","Capillaries","Bronchi","Trachea"])});}
    if(topic==="Circulatory"){q=`What part of the blood carries oxygen?`; a="Red blood cells"; qs.push({q,a,choices:shuffle([a,"White blood cells","Plasma","Platelets","Water"])});}
    if(topic==="Circulatory"){q=`What part of the blood helps fight infection?`; a="White blood cells"; qs.push({q,a,choices:shuffle([a,"Red blood cells","Platelets","Plasma","Hormones"])});}
    if(topic==="Circulatory"){q=`What part of blood helps it to clot?`; a="Platelets"; qs.push({q,a,choices:shuffle([a,"Plasma","White blood cells","Nutrients","Fibrin"])});}
    if(topic==="Circulatory"){q=`Which liquid part of blood carries nutrients?`; a="Plasma"; qs.push({q,a,choices:shuffle([a,"Water","Platelets","Lymph","Hemoglobin"])});}
    if(topic==="Circulatory"){q=`Which side of the heart pumps oxygenated blood?`; a="Left side"; qs.push({q,a,choices:shuffle([a,"Right side","Back side","Upper part","Lower part"])});}
    if(topic==="Circulatory"){q=`Which side of the heart pumps deoxygenated blood?`; a="Right side"; qs.push({q,a,choices:shuffle([a,"Left side","Upper part","Lower part","Outer wall"])});}
    if(topic==="Circulatory"){q=`What connects arteries and veins?`; a="Capillaries"; qs.push({q,a,choices:shuffle([a,"Veins","Arteries","Nerves","Bronchi"])});}
    if(topic==="Circulatory"){q=`What is the largest artery in the body?`; a="Aorta"; qs.push({q,a,choices:shuffle([a,"Pulmonary artery","Vena cava","Vein","Lymph duct"])});}
    if(topic==="Circulatory"){q=`What is the heartbeat sound caused by?`; a="Heart valves closing"; qs.push({q,a,choices:shuffle([a,"Blood flow","Breathing","Muscle movement","Veins contracting"])});}

    if(topic==="Respiratory"){q=`Which organ allows us to breathe?`; a="Lungs"; qs.push({q,a,choices:shuffle([a,"Heart","Liver","Stomach","Brain"])});}
    if(topic==="Respiratory"){q=`What tube carries air to the lungs?`; a="Trachea"; qs.push({q,a,choices:shuffle([a,"Esophagus","Vein","Aorta","Bronchus"])});}
    if(topic==="Respiratory"){q=`What tiny sacs in the lungs exchange oxygen and carbon dioxide?`; a="Alveoli"; qs.push({q,a,choices:shuffle([a,"Bronchi","Capillaries","Villi","Cells"])});}
    if(topic==="Respiratory"){q=`What muscle helps us breathe in and out?`; a="Diaphragm"; qs.push({q,a,choices:shuffle([a,"Heart","Lungs","Liver","Chest muscles"])});}
    if(topic==="Respiratory"){q=`Which gas do we inhale?`; a="Oxygen"; qs.push({q,a,choices:shuffle([a,"Carbon dioxide","Nitrogen","Helium","Hydrogen"])});}
    if(topic==="Respiratory"){q=`Which gas do we exhale?`; a="Carbon dioxide"; qs.push({q,a,choices:shuffle([a,"Oxygen","Hydrogen","Nitrogen","Water vapor"])});}
    if(topic==="Respiratory"){q=`What is the main function of the respiratory system?`; a="To provide oxygen and remove carbon dioxide"; qs.push({q,a,choices:shuffle([a,"To digest food","To pump blood","To filter waste","To protect the body"])});}
    if(topic==="Respiratory"){q=`Where does gas exchange happen?`; a="Alveoli"; qs.push({q,a,choices:shuffle([a,"Bronchi","Trachea","Larynx","Pharynx"])});}
    if(topic==="Respiratory"){q=`What protects the lungs inside the chest?`; a="Rib cage"; qs.push({q,a,choices:shuffle([a,"Skull","Spine","Pelvis","Arm bones"])});}
    if(topic==="Respiratory"){q=`What causes hiccups?`; a="Diaphragm spasm"; qs.push({q,a,choices:shuffle([a,"Heart attack","Lung blockage","Cold air","Coughing"])});}

    if(topic==="Digestive"){q=`Where does food get digested first?`; a="Stomach"; qs.push({q,a,choices:shuffle([a,"Mouth","Liver","Small intestine","Pancreas"])});}
    if(topic==="Digestive"){q=`Where does digestion begin?`; a="Mouth"; qs.push({q,a,choices:shuffle([a,"Stomach","Intestine","Liver","Throat"])});}
    if(topic==="Digestive"){q=`Which organ produces bile?`; a="Liver"; qs.push({q,a,choices:shuffle([a,"Pancreas","Gallbladder","Stomach","Kidney"])});}
    if(topic==="Digestive"){q=`Where is bile stored?`; a="Gallbladder"; qs.push({q,a,choices:shuffle([a,"Liver","Pancreas","Kidney","Appendix"])});}
    if(topic==="Digestive"){q=`Which organ absorbs nutrients from food?`; a="Small intestine"; qs.push({q,a,choices:shuffle([a,"Large intestine","Stomach","Esophagus","Pancreas"])});}
    if(topic==="Digestive"){q=`Which organ absorbs water from waste?`; a="Large intestine"; qs.push({q,a,choices:shuffle([a,"Small intestine","Stomach","Liver","Gallbladder"])});}
    if(topic==="Digestive"){q=`Which enzyme in saliva breaks down starch?`; a="Amylase"; qs.push({q,a,choices:shuffle([a,"Lipase","Pepsin","Bile","Insulin"])});}
    if(topic==="Digestive"){q=`Which organ connects the mouth to the stomach?`; a="Esophagus"; qs.push({q,a,choices:shuffle([a,"Trachea","Larynx","Bronchus","Pharynx"])});}
    if(topic==="Digestive"){q=`What organ produces insulin and digestive enzymes?`; a="Pancreas"; qs.push({q,a,choices:shuffle([a,"Liver","Kidney","Gallbladder","Appendix"])});}
    if(topic==="Digestive"){q=`What helps move food along the digestive tract?`; a="Peristalsis"; qs.push({q,a,choices:shuffle([a,"Coughing","Digestion","Absorption","Filtration"])});}

    if(topic==="Nervous"){q=`Which organ controls our body and senses?`; a="Brain"; qs.push({q,a,choices:shuffle([a,"Heart","Lungs","Liver","Stomach"])});}
    if(topic==="Nervous"){q=`What carries messages between the brain and body?`; a="Nerves"; qs.push({q,a,choices:shuffle([a,"Bones","Veins","Arteries","Muscles"])});}
    if(topic==="Nervous"){q=`What is the main function of the spinal cord?`; a="To relay messages to and from the brain"; qs.push({q,a,choices:shuffle([a,"To digest food","To pump blood","To store fat","To make hormones"])});}
    if(topic==="Nervous"){q=`What are the basic units of the nervous system?`; a="Neurons"; qs.push({q,a,choices:shuffle([a,"Cells","Muscles","Bones","Organs"])});}
    if(topic==="Nervous"){q=`Which part of the brain controls balance?`; a="Cerebellum"; qs.push({q,a,choices:shuffle([a,"Cerebrum","Medulla","Spinal cord","Frontal lobe"])});}
    if(topic==="Nervous"){q=`Which part of the brain controls thinking and memory?`; a="Cerebrum"; qs.push({q,a,choices:shuffle([a,"Cerebellum","Brain stem","Medulla","Pons"])});}
    if(topic==="Nervous"){q=`Which part of the brain controls involuntary actions?`; a="Medulla oblongata"; qs.push({q,a,choices:shuffle([a,"Cerebrum","Cerebellum","Thalamus","Hypothalamus"])});}
    if(topic==="Nervous"){q=`What protects the brain?`; a="Skull"; qs.push({q,a,choices:shuffle([a,"Ribs","Pelvis","Spine","Skin"])});}
    if(topic==="Nervous"){q=`What protects the spinal cord?`; a="Vertebral column"; qs.push({q,a,choices:shuffle([a,"Ribs","Pelvis","Skull","Sternum"])});}
    if(topic==="Nervous"){q=`What is the function of reflex actions?`; a="Quick response to stimuli"; qs.push({q,a,choices:shuffle([a,"Slow thinking","Sleep control","Digestion","Sweating"])});}

    if(topic==="Skeletal/Muscular"){q=`What gives our body structure and allows movement?`; a="Bones and Muscles"; qs.push({q,a,choices:shuffle([a,"Heart and Lungs","Brain and Spine","Veins and Arteries","Skin and Hair"])});}
    if(topic==="Skeletal/Muscular"){q=`How many bones are in an adult human body?`; a="206"; qs.push({q,a,choices:shuffle([a,"201","150","208","180"])});}
    if(topic==="Skeletal/Muscular"){q=`What connects bones to muscles?`; a="Tendons"; qs.push({q,a,choices:shuffle([a,"Ligaments","Cartilage","Skin","Veins"])});}
    if(topic==="Skeletal/Muscular"){q=`What connects bones to other bones?`; a="Ligaments"; qs.push({q,a,choices:shuffle([a,"Tendons","Cartilage","Flesh","Joints"])});}
    if(topic==="Skeletal/Muscular"){q=`Where are red blood cells made?`; a="Bone marrow"; qs.push({q,a,choices:shuffle([a,"Liver","Heart","Veins","Lungs"])});}
    if(topic==="Skeletal/Muscular"){q=`What covers the ends of bones to prevent friction?`; a="Cartilage"; qs.push({q,a,choices:shuffle([a,"Tendon","Ligament","Muscle","Fat"])});}
    if(topic==="Skeletal/Muscular"){q=`Which type of muscle moves bones?`; a="Skeletal muscle"; qs.push({q,a,choices:shuffle([a,"Smooth muscle","Cardiac muscle","Involuntary muscle","Elastic tissue"])});}
    if(topic==="Skeletal/Muscular"){q=`Which muscle works without us thinking?`; a="Involuntary muscle"; qs.push({q,a,choices:shuffle([a,"Voluntary muscle","Skeletal muscle","Smooth muscle","Joint muscle"])});}
    if(topic==="Skeletal/Muscular"){q=`Which muscle controls the heart?`; a="Cardiac muscle"; qs.push({q,a,choices:shuffle([a,"Smooth muscle","Skeletal muscle","Involuntary muscle","Tissue muscle"])});}
    if(topic==="Skeletal/Muscular"){q=`Which joint allows movement in all directions?`; a="Ball and socket joint"; qs.push({q,a,choices:shuffle([a,"Hinge joint","Fixed joint","Pivot joint","Sliding joint"])});}
    if(topic==="Skeletal/Muscular"){q=`Which joint allows back and forth movement?`; a="Hinge joint"; qs.push({q,a,choices:shuffle([a,"Ball and socket","Pivot","Fixed","Sliding"])});}
  }
  return qs;
}

// Quiz
function startQuiz(subject,lesson){
  // increment session and capture for this quiz instance
  quizSessionId++;
  const mySession = quizSessionId;

  const quizContainer=document.getElementById("quizContainer");
  quizContainer.innerHTML = "";
  document.getElementById("folkloreContainer").classList.add("hidden");

  const pool=generateQuestionPool(subject,lesson);
  const quizSet=shuffle(pool).slice(0,Math.floor(Math.random()*6)+5); // 5-10 questions
  let current=0, score=0;

  function showQuestion(){
    // if session changed, stop rendering this quiz
    if(mySession !== quizSessionId) return;

    quizContainer.innerHTML=`<h4>Q${current+1}: ${quizSet[current].q}</h4>`;
    const choicesEl=document.createElement("div");
    choicesEl.className = "choices";
    quizContainer.appendChild(choicesEl);

    quizSet[current].choices.forEach(choice=>{
      const btn=document.createElement("button");
      btn.innerText=choice;
      btn.onclick=()=>{
        if(mySession !== quizSessionId) return; // abort if user switched
        if(choice===quizSet[current].a){btn.classList.add("correct"); score++;}
        else{btn.classList.add("wrong");}

        Array.from(choicesEl.children).forEach(b=>b.disabled=true);

        setTimeout(()=>{
          if(mySession !== quizSessionId) return;
          current++;
          if(current<quizSet.length){showQuestion();}
          else{finishQuiz();}
        },700);
      };
      choicesEl.appendChild(btn);
    });
  }
  showQuestion();

  function finishQuiz(){
    if(mySession !== quizSessionId) return;
    alert(`You scored ${score} out of ${quizSet.length}`);

    const percent = (score/quizSet.length)*100;

    // Track completions
    if(!users[currentUser].completions[lesson]) users[currentUser].completions[lesson]=0;
    users[currentUser].completions[lesson]++;
    users[currentUser].lessonsCompleted++;
    users[currentUser].scores.push(score);

    // Badge upgrade only if ≥65%
    if(percent>=65){
      let badge = getBadgeLevel(users[currentUser].completions[lesson]);
      users[currentUser].badges.push(`${lesson}: ${badge}`);
      users[currentUser].certificates.push(`${lesson} - ${badge}`);
      showCertificate(currentUser, lesson, badge);
    }

    localStorage.setItem("users", JSON.stringify(users));
  }
}

// Badge helper
function getBadgeLevel(attempt){
  if(attempt===1) return "Bronze Star";
  if(attempt===2) return "Silver Star";
  if(attempt===3) return "Gold Star";
  return "Diamond Badge";
}

// Shuffle helper
function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

// Certificate (show UI)
function showCertificate(user, lesson, badge){
  const cert = document.getElementById("certificatePage");
  cert.classList.remove("hidden");
  cert.style.display = "block";
  document.getElementById("certName").innerText = users[user].fullName;
  document.getElementById("certLesson").innerText = lesson;
  document.getElementById("certBadge").innerText = badge;
  // Smooth scroll / focus
  cert.scrollIntoView({behavior:"smooth",block:"center"});
}

// Profile
function openProfile(){
  document.getElementById("homePage").classList.add("hidden");
  document.getElementById("profilePage").classList.remove("hidden");
  const u=users[currentUser];
  document.getElementById("profileName").innerText=u.fullName;
  document.getElementById("profileUsername").innerText=currentUser;
  document.getElementById("profileLessons").innerText=u.lessonsCompleted;
  const avg=u.scores.length?Math.round(u.scores.reduce((a,b)=>a+b)/u.scores.length):0;
  document.getElementById("profileScore").innerText=avg;

  const certList=document.getElementById("certificatesList");
  certList.innerHTML="";
  u.certificates.forEach(c=>{
    let li=document.createElement("li");
    li.innerText=c;
    certList.appendChild(li);
  });

  const badgesList=document.getElementById("badgesList");
  badgesList.innerHTML="";
  u.badges.forEach(b=>{
    let li=document.createElement("li");
    li.innerText=b;
    badgesList.appendChild(li);
  });
}

// DOWNLOAD Certificate as PNG (Canvas)
function downloadCertificate(){
  const name = document.getElementById("certName").innerText || "Student";
  const lesson = document.getElementById("certLesson").innerText || "Lesson";
  const badge = document.getElementById("certBadge").innerText || "";

  const canvas = document.getElementById("certCanvas");
  const ctx = canvas.getContext("2d");

  // Draw background
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // soft gradient
  const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  g.addColorStop(0, "#fffaf0");
  g.addColorStop(1, "#f0f7ff");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // border
  ctx.strokeStyle = "#f2c94c";
  ctx.lineWidth = 8;
  roundRect(ctx, 24, 24, canvas.width-48, canvas.height-48, 28, false, true);

  // Confetti (simple circles)
  for(let i=0;i<60;i++){
    const cx = Math.random()*(canvas.width-100)+50;
    const cy = Math.random()*(canvas.height-200)+80;
    const r = Math.random()*6 + 2;
    ctx.beginPath();
    ctx.fillStyle = randomPastel();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.fill();
  }

  // Title
  ctx.fillStyle = "#333";
  ctx.font = "48px 'Poppins', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Certificate of Completion", canvas.width/2, 160);

  // Motivational subtitle in script font
  ctx.fillStyle = "#2b7a78";
  ctx.font = "48px 'Great Vibes', cursive";
  ctx.fillText("Congratulations!", canvas.width/2, 220);

  // Student name
  ctx.fillStyle = "#111";
  ctx.font = "36px 'Poppins', sans-serif";
  ctx.fillText(name, canvas.width/2, 320);

  // Lesson
  ctx.font = "28px 'Poppins', sans-serif";
  ctx.fillText(`For successfully completing: ${lesson}`, canvas.width/2, 380);

  // Badge
  if(badge){
    ctx.fillStyle = "#ff7043";
    ctx.font = "24px 'Poppins', sans-serif";
    ctx.fillText(`Badge earned: ${badge}`, canvas.width/2, 430);
  }

  // Footer
  ctx.fillStyle = "#555";
  ctx.font = "18px 'Poppins', sans-serif";
  ctx.fillText("ISIP BATA — Keep learning, keep shining ✨", canvas.width/2, canvas.height - 80);

  // convert to data URL and download
  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  const safeName = name.replace(/\s+/g, "_").replace(/[^\w\-]/g, "");
  const safeLesson = lesson.replace(/\s+/g, "_").replace(/[^\w\-]/g, "");
  link.download = `${safeName}_${safeLesson}_Certificate.png`;
  link.click();
}

// small helpers
function randomPastel(){
  const hues = ["#FFD6A5","#FDFFA5","#BDE0FE","#FBB4B4","#CDEAC0","#FFECB3","#E0BBE4"];
  return hues[Math.floor(Math.random()*hues.length)];
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}

function animateCard(el){
  if(!el) return;
  el.style.transition = "transform 300ms ease, opacity 300ms ease";
  el.style.transform = "translateY(8px)";
  el.style.opacity = "0";
  requestAnimationFrame(()=> {
    el.style.transform = "translateY(0)";
    el.style.opacity = "1";
  });
}
