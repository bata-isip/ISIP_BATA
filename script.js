// --- script.js
let currentUser = null;
let users = JSON.parse(localStorage.getItem("users")) || {};

// session id to cancel previous quizzes when switching lessons/pages
let quizSessionId = 0;

// Registration/Login
function showRegister(){
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.remove("hidden");
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
  quizSessionId++;
}

// Subjects
function openSubject(subject){
  quizSessionId++;
  document.getElementById("homePage").classList.add("hidden");
  document.getElementById("lessonPage").classList.remove("hidden");
  document.getElementById("lessonTitle").innerText=subject+" Lessons";
  showLessonContent(subject);
  document.getElementById("quizContainer").innerHTML = "";
  document.getElementById("folkloreContainer").classList.add("hidden");
}

function goHome(){
  quizSessionId++;
  document.getElementById("lessonPage").classList.add("hidden");
  document.getElementById("profilePage").classList.add("hidden");
  document.getElementById("certificatePage").classList.add("hidden");
  document.getElementById("homePage").classList.remove("hidden");
  document.getElementById("quizContainer").innerHTML = "";
  document.getElementById("folkloreContainer").classList.add("hidden");
}

// Lessons per subject
const lessonsContent = {
  Math:["Addition","Subtraction","Multiplication","Division"],
  Science:["Circulatory","Respiratory","Digestive","Nervous","Skeletal/Muscular"],
  "English Vocabulary":["Animals","Colors","Numbers","Fruits"],
  "Filipino Vocabulary":["Hayop","Kulay","Numero","Prutas"]
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
  let questions=[];
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
    questions.push(...generateScienceQuestions(lesson,20));
  } else if(subject==="English Vocabulary" || subject==="Filipino Vocabulary"){
    questions.push(...generateVocabularyQuestions(subject,lesson));
  }
  return questions;
}

// --- Science questions (same as before) ---
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

// --- Vocabulary questions ---
function generateVocabularyQuestions(subject, lesson){
  const qs=[];
  // English Vocabulary
  if(subject==="English Vocabulary"){
    if(lesson==="Animals"){
        qs.push({q:"What is a 'dog'?", a:"A domesticated animal", choices:shuffle(["A domesticated animal","A fruit","A color","A vehicle"])});
        qs.push({q:"What is a 'cat'?", a:"A small domesticated animal", choices:shuffle(["A small domesticated animal","A type of plant","A number","A school subject"])});
        qs.push({q:"What is a 'bird'?", a:"An animal that can fly", choices:shuffle(["An animal that can fly","A type of food","A color","A toy"])});
        qs.push({q:"What is a 'fish'?", a:"An animal that lives in water", choices:shuffle(["An animal that lives in water","A flying insect","A fruit","A building"])});
        qs.push({q:"What is a 'cow'?", a:"An animal that gives milk", choices:shuffle(["An animal that gives milk","A type of tree","A color","A vehicle"])});
        qs.push({q:"What is a 'lion'?", a:"A big wild cat", choices:shuffle(["A big wild cat","A small bird","A type of fish","A fruit"])});
        qs.push({q:"What is a 'tiger'?", a:"A striped wild cat", choices:shuffle(["A striped wild cat","A vegetable","A type of car","A planet"])});
        qs.push({q:"What is a 'elephant'?", a:"A large animal with a trunk", choices:shuffle(["A large animal with a trunk","A small insect","A type of shoe","A flower"])});
        qs.push({q:"What is a 'monkey'?", a:"An animal that climbs trees", choices:shuffle(["An animal that climbs trees","A type of fish","A bird","A chair"])});
        qs.push({q:"What is a 'rabbit'?", a:"A small animal with long ears", choices:shuffle(["A small animal with long ears","A vehicle","A color","A building"])});
        qs.push({q:"What is a 'horse'?", a:"An animal used for riding", choices:shuffle(["An animal used for riding","A type of food","A tree","A chair"])});
        qs.push({q:"What is a 'sheep'?", a:"An animal that gives wool", choices:shuffle(["An animal that gives wool","A fruit","A car","A mountain"])});
      qs.push({q:"What is a 'goat'?", a:"An animal with horns", choices:shuffle(["An animal with horns","A type of flower","A building","A planet"])});
        qs.push({q:"What is a 'duck'?", a:"A bird that swims", choices:shuffle(["A bird that swims","A type of fruit","A car","A chair"])});
        qs.push({q:"What is a 'chicken'?", a:"A bird that lays eggs", choices:shuffle(["A bird that lays eggs","A type of tree","A vehicle","A fruit"])});
        qs.push({q:"What is a 'bear'?", a:"A large wild animal", choices:shuffle(["A large wild animal","A small insect","A color","A building"])});
        qs.push({q:"What is a 'wolf'?", a:"A wild animal that lives in packs", choices:shuffle(["A wild animal that lives in packs","A tree","A chair","A planet"])});
      qs.push({q:"What is a 'fox'?", a:"A small wild animal with a bushy tail", choices:shuffle(["A small wild animal with a bushy tail","A type of fish","A color","A flower"])});
      qs.push({q:"What is a 'frog'?", a:"An animal that can jump and croak", choices:shuffle(["An animal that can jump and croak","A vehicle","A fruit","A chair"])});
        qs.push({q:"What is a 'snake'?", a:"A legless reptile", choices:shuffle(["A legless reptile","A bird","A flower","A car"])});
        qs.push({q:"What is a 'penguin'?", a:"A bird that cannot fly", choices:shuffle(["A bird that cannot fly","A fish","A mammal","A vehicle"])});
    qs.push({q:"What is a 'koala'?", a:"A tree-dwelling animal", choices:shuffle(["A tree-dwelling animal","A type of bird","A fruit","A flower"])});
  qs.push({q:"What is a 'kangaroo'?", a:"An animal that hops", choices:shuffle(["An animal that hops","A small fish","A bird","A tree"])});
  qs.push({q:"What is a 'panda'?", a:"A bear that eats bamboo", choices:shuffle(["A bear that eats bamboo","A type of cat","A fish","A flower"])});
 qs.push({q:"What is a 'whale'?", a:"A large sea mammal", choices:shuffle(["A large sea mammal","A type of bird","A reptile","A tree"])});
  qs.push({q:"What is a 'dolphin'?", a:"A smart marine animal", choices:shuffle(["A smart marine animal","A land animal","A bird","A vegetable"])});
  qs.push({q:"What is a 'shark'?", a:"A predator fish", choices:shuffle(["A predator fish","A mammal","A bird","A tree"])});
    qs.push({q:"What is a 'crab'?", a:"A crustacean that walks sideways", choices:shuffle(["A crustacean that walks sideways","A bird","A mammal","A vegetable"])});
  qs.push({q:"What is a 'lobster'?", a:"A sea animal with claws", choices:shuffle(["A sea animal with claws","A type of bird","A mammal","A tree"])});
qs.push({q:"What is a 'octopus'?", a:"A sea animal with eight arms", choices:shuffle(["A sea animal with eight arms","A fish","A bird","A reptile"])});

    }
    if(lesson==="Colors"){
      qs.push({q:"What color is the sky?", a:"Blue", choices:shuffle(["Blue","Red","Green","Yellow"])});
      qs.push({q:"What color is a lemon?", a:"Yellow", choices:shuffle(["Yellow","Purple","Orange","Black"])});
      qs.push({q:"What color is grass?", a:"Green", choices:shuffle(["Green","Pink","White","Brown"])});
    }
    if(lesson==="Numbers"){
      qs.push({q:"How many fingers do we have?", a:"10", choices:shuffle(["10","5","20","15"])});
      qs.push({q:"What comes after 2?", a:"3", choices:shuffle(["3","4","1","5"])});
      qs.push({q:"How many days are in a week?", a:"7", choices:shuffle(["7","5","10","6"])});
    }
    if(lesson==="Fruits"){
      qs.push({q:"Which is a fruit?", a:"Apple", choices:shuffle(["Apple","Carrot","Potato","Lettuce"])});
      qs.push({q:"Which is yellow and sour?", a:"Lemon", choices:shuffle(["Lemon","Banana","Apple","Mango"])});
      qs.push({q:"Which fruit is tropical and orange inside?", a:"Mango", choices:shuffle(["Mango","Apple","Strawberry","Grapes"])});
    }
  }

  // Filipino Vocabulary
  if(subject==="Filipino Vocabulary"){
    if(lesson==="Hayop"){
      qs.push({q:"Ano ang 'aso'?", a:"A domesticated animal", choices:shuffle(["A domesticated animal","A fruit","A color","A vehicle"])});
      qs.push({q:"Ano ang 'pusa'?", a:"A small domesticated animal", choices:shuffle(["A small domesticated animal","A type of plant","A number","A school subject"])});
      qs.push({q:"Ano ang 'ibon'?", a:"An animal that can fly", choices:shuffle(["An animal that can fly","A type of food","A color","A toy"])});
    }
    if(lesson==="Kulay"){
      qs.push({q:"Ano ang kulay ng langit?", a:"Asul", choices:shuffle(["Asul","Pula","Berde","Dilaw"])});
      qs.push({q:"Ano ang kulay ng lemon?", a:"Dilaw", choices:shuffle(["Dilaw","Lila","Kahel","Itim"])});
      qs.push({q:"Ano ang kulay ng damo?", a:"Berde", choices:shuffle(["Berde","Rosas","Puti","Kayumanggi"])});
    }
    if(lesson==="Numero"){
      qs.push({q:"Ilan ang daliri natin?", a:"10", choices:shuffle(["10","5","20","15"])});
      qs.push({q:"Ano ang kasunod ng 2?", a:"3", choices:shuffle(["3","4","1","5"])});
      qs.push({q:"Ilang araw sa isang linggo?", a:"7", choices:shuffle(["7","5","10","6"])});
    }
    if(lesson==="Prutas"){
      qs.push({q:"Alin ang prutas?", a:"Mansanas", choices:shuffle(["Mansanas","Karot","Patatas","Lettuce"])});
      qs.push({q:"Aling prutas ay dilaw at maasim?", a:"Lemon", choices:shuffle(["Lemon","Saging","Mansanas","Mango"])});
      qs.push({q:"Aling prutas ay tropikal at kulay kahel sa loob?", a:"Mango", choices:shuffle(["Mango","Mansanas","Strawberry","Ubas"])});
    }
  }

  return qs;
}

// --- Folklore Stories ---
const folkloreStories = [
  "Legend of Mariang Makiling",
  "The Monkey and the Turtle",
  "Alamat ng Pinya",
  "Alamat ng Rosas",
  "Legend of Bathala",
  "The Clever Rabbit",
  "Legend of Mayon Volcano",
  "The Tale of Juan Tamad",
  "Alamat ng Bahaghari",
  "The Talking Bird"
];

// Quiz
function startQuiz(subject,lesson){
  quizSessionId++;
  const mySession = quizSessionId;
  const quizContainer=document.getElementById("quizContainer");
  quizContainer.innerHTML = "";
  document.getElementById("folkloreContainer").classList.add("hidden");

  const pool=generateQuestionPool(subject,lesson);
  const quizSet=shuffle(pool).slice(0,Math.floor(Math.random()*6)+5); // 5-10 questions
  let current=0, score=0;

  function showQuestion(){
    if(mySession !== quizSessionId) return;
    quizContainer.innerHTML=`<h4>Q${current+1}: ${quizSet[current].q}</h4>`;
    const choicesEl=document.createElement("div");
    choicesEl.className = "choices";
    quizContainer.appendChild(choicesEl);

    quizSet[current].choices.forEach(choice=>{
      const btn=document.createElement("button");
      btn.innerText=choice;
      btn.onclick=()=>{
        if(mySession !== quizSessionId) return;
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

    if(!users[currentUser].completions[lesson]) users[currentUser].completions[lesson]=0;
    users[currentUser].completions[lesson]++;
    users[currentUser].lessonsCompleted++;
    users[currentUser].scores.push(score);

    if(percent>=65){
      let badge = getBadgeLevel(users[currentUser].completions[lesson]);
      users[currentUser].badges.push(`${lesson}: ${badge}`);
      users[currentUser].certificates.push(`${lesson} - ${badge}`);
      showCertificate(currentUser, lesson, badge);
    }

    localStorage.setItem("users", JSON.stringify(users));

    // --- Show random folklore story ---
    const folkloreContainer=document.getElementById("folkloreContainer");
    folkloreContainer.innerHTML=`<h4>Random Folklore Story:</h4><p>${folkloreStories[Math.floor(Math.random()*folkloreStories.length)]}</p>`;
    folkloreContainer.classList.remove("hidden");
  }
}

// --- Badge helper ---
function getBadgeLevel(attempt){
  if(attempt===1) return "Bronze Star";
  if(attempt===2) return "Silver Star";
  if(attempt===3) return "Gold Star";
  return "Diamond Badge";
}

// --- Shuffle helper ---
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
  u.certificates.forEach(c=>{let li=document.createElement("li");li.innerText=c;certList.appendChild(li);});

  const badgesList=document.getElementById("badgesList");
  badgesList.innerHTML="";
  u.badges.forEach(b=>{let li=document.createElement("li");li.innerText=b;badgesList.appendChild(li);});
}

// DOWNLOAD Certificate as PNG
function downloadCertificate(){
  const name = document.getElementById("certName").innerText || "Student";
  const lesson = document.getElementById("certLesson").innerText || "Lesson";
  const badge = document.getElementById("certBadge").innerText || "";

  const canvas = document.getElementById("certCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  g.addColorStop(0, "#fffaf0");
  g.addColorStop(1, "#f0f7ff");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.strokeStyle = "#f2c94c";
  ctx.lineWidth = 8;
  roundRect(ctx, 24, 24, canvas.width-48, canvas.height-48, 28, false, true);

  for(let i=0;i<60;i++){
    const cx = Math.random()*(canvas.width-100)+50;
    const cy = Math.random()*(canvas.height-200)+80;
    const r = Math.random()*6 + 2;
    ctx.beginPath();
    ctx.fillStyle = randomPastel();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.fill();
  }

  ctx.fillStyle = "#333";
  ctx.font = "48px 'Poppins', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Certificate of Completion", canvas.width/2, 160);
  ctx.fillStyle = "#2b7a78";
  ctx.font = "48px 'Great Vibes', cursive";
  ctx.fillText("Congratulations!", canvas.width/2, 220);

  ctx.fillStyle = "#111";
  ctx.font = "36px 'Poppins', sans-serif";
  ctx.fillText(name, canvas.width/2, 320);

  ctx.font = "28px 'Poppins', sans-serif";
  ctx.fillText(`For successfully completing: ${lesson}`, canvas.width/2, 380);

  if(badge){
    ctx.fillStyle = "#ff7043";
    ctx.font = "24px 'Poppins', sans-serif";
    ctx.fillText(`Badge earned: ${badge}`, canvas.width/2, 430);
  }

  ctx.fillStyle = "#555";
  ctx.font = "18px 'Poppins', sans-serif";
  ctx.fillText("ISIP BATA — Keep learning, keep shining ✨", canvas.width/2, canvas.height - 80);

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
  const hues = ["#FFD6A5","#FDFFA5","#BDE0FE","#FBB4B4","#CDB4DB","#B5EAEA","#FFABAB"];
  return hues[Math.floor(Math.random()*hues.length)];
}
function roundRect(ctx, x, y, w, h, r, fill, stroke){
  if(typeof stroke==='undefined'){stroke=true;}
  if(typeof r==='undefined'){r=5;}
  if(typeof r==='number'){r={tl:r,tr:r,br:r,bl:r};}else{const defaultRadius={tl:0,tr:0,br:0,bl:0}; for(let k in defaultRadius){r[k]=r[k]||defaultRadius[k];}}
  ctx.beginPath();
  ctx.moveTo(x+r.tl,y);
  ctx.lineTo(x+w-r.tr,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r.tr);
  ctx.lineTo(x+w,y+h-r.br);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r.br,y+h);
  ctx.lineTo(x+r.bl,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r.bl);
  ctx.lineTo(x,y+r.tl);
  ctx.quadraticCurveTo(x,y,x+r.tl,y);
  ctx.closePath();
  if(fill)ctx.fill();
  if(stroke)ctx.stroke();
}

// Animate card
function animateCard(el){
  el.style.transform="scale(0.9)";
  setTimeout(()=>{el.style.transform="scale(1)";},150);
}

