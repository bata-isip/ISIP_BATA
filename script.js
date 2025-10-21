// script.js
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
  pwd.type = pwd.type === 'password' ? 'text' : 'password';
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
  quizSessionId++; // cancel previous quiz instance if any
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
  "Filipino Vocabulary":["Hayop","Kulay","Numero","Prutas"],
  "Philippine History":["Pre-colonial Philippines","Spanish Colonization","Philippine Revolution"]
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
  } else if(subject==="Philippine History"){
    questions.push(...generatePhilippineHistoryQuestions(lesson));
  }
  return questions;
}

//
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
    qs.push({q:"What color is an apple?", a:"Red", choices:shuffle(["Red","Blue","White","Gray"])});
    qs.push({q:"What color is a carrot?", a:"Orange", choices:shuffle(["Orange","Purple","Green","Black"])});
    qs.push({q:"What color is a banana?", a:"Yellow", choices:shuffle(["Yellow","Red","Blue","Pink"])});
    qs.push({q:"What color is a grape?", a:"Purple", choices:shuffle(["Purple","Green","Red","Orange"])});
    qs.push({q:"What color is snow?", a:"White", choices:shuffle(["White","Blue","Brown","Black"])});
    qs.push({q:"What color is coal?", a:"Black", choices:shuffle(["Black","White","Red","Green"])});
    qs.push({q:"What color is chocolate?", a:"Brown", choices:shuffle(["Brown","Pink","Blue","Orange"])});
    qs.push({q:"What color is a strawberry?", a:"Red", choices:shuffle(["Red","Green","Yellow","Purple"])});
    qs.push({q:"What color is a pumpkin?", a:"Orange", choices:shuffle(["Orange","Blue","White","Black"])});
    qs.push({q:"What color is a cucumber?", a:"Green", choices:shuffle(["Green","Red","Yellow","Pink"])});
    qs.push({q:"What color is a rose?", a:"Red", choices:shuffle(["Red","Blue","Brown","Black"])});
    qs.push({q:"What color is a blueberry?", a:"Blue", choices:shuffle(["Blue","Green","Red","Yellow"])});
    qs.push({q:"What color is a lemon slice?", a:"Yellow", choices:shuffle(["Yellow","Orange","Green","Purple"])});
    qs.push({q:"What color is a cloud?", a:"White", choices:shuffle(["White","Blue","Gray","Black"])});
    qs.push({q:"What color is a night sky?", a:"Black", choices:shuffle(["Black","Blue","Purple","White"])});
    qs.push({q:"What color is a pink flamingo?", a:"Pink", choices:shuffle(["Pink","Red","Orange","Yellow"])});
    qs.push({q:"What color is a rainbow?", a:"Multicolor", choices:shuffle(["Multicolor","Single color","Gray","Black"])});
    qs.push({q:"What color is an orange fruit?", a:"Orange", choices:shuffle(["Orange","Red","Yellow","Green"])});
    qs.push({q:"What color is a cherry?", a:"Red", choices:shuffle(["Red","Blue","Green","Yellow"])});
    qs.push({q:"What color is a lemon peel?", a:"Yellow", choices:shuffle(["Yellow","Green","Orange","White"])});
    qs.push({q:"What color is a frog?", a:"Green", choices:shuffle(["Green","Brown","Blue","Red"])});
    qs.push({q:"What color is coal?", a:"Black", choices:shuffle(["Black","White","Gray","Brown"])});
    qs.push({q:"What color is sand?", a:"Brown", choices:shuffle(["Brown","Yellow","White","Orange"])});
    qs.push({q:"What color is a tulip?", a:"Red", choices:shuffle(["Red","Pink","Purple","Yellow"])});
    qs.push({q:"What color is the ocean?", a:"Blue", choices:shuffle(["Blue","Green","Black","White"])});
    qs.push({q:"What color is a pumpkin?", a:"Orange", choices:shuffle(["Orange","Yellow","Red","Green"])});
    qs.push({q:"What color is a kiwi inside?", a:"Green", choices:shuffle(["Green","Brown","Yellow","Red"])});
    qs.push({q:"What color is a cloud at sunset?", a:"Pink", choices:shuffle(["Pink","Red","Orange","Purple"])});
    qs.push({q:"What color is a sunflower?", a:"Yellow", choices:shuffle(["Yellow","Orange","Red","Brown"])});
    qs.push({q:"What color is coal?", a:"Black", choices:shuffle(["Black","Gray","White","Blue"])});
    qs.push({q:"What color is chocolate?", a:"Brown", choices:shuffle(["Brown","Black","Yellow","Orange"])});
    qs.push({q:"What color is a rose?", a:"Red", choices:shuffle(["Red","Pink","White","Orange"])});
    qs.push({q:"What color is the sky at noon?", a:"Blue", choices:shuffle(["Blue","White","Gray","Black"])});
    qs.push({q:"What color is a ripe mango?", a:"Orange", choices:shuffle(["Orange","Yellow","Green","Red"])});
    qs.push({q:"What color is a watermelon inside?", a:"Red", choices:shuffle(["Red","Green","Yellow","Pink"])});
    qs.push({q:"What color is a lemon fruit?", a:"Yellow", choices:shuffle(["Yellow","Green","Orange","White"])});
    qs.push({q:"What color is a blueberry?", a:"Blue", choices:shuffle(["Blue","Red","Purple","Black"])});
    qs.push({q:"What color is a pink balloon?", a:"Pink", choices:shuffle(["Pink","Red","White","Orange"])});
    qs.push({q:"What color is a rainbow?", a:"Multicolor", choices:shuffle(["Multicolor","Single color","Gray","Black"])});
}

if(lesson==="Numbers"){
    qs.push({q:"How many fingers do we have?", a:"10", choices:shuffle(["10","5","20","15"])});
    qs.push({q:"What comes after 2?", a:"3", choices:shuffle(["3","4","1","5"])});
    qs.push({q:"How many days are in a week?", a:"7", choices:shuffle(["7","5","10","6"])});
    qs.push({q:"What number comes before 5?", a:"4", choices:shuffle(["4","3","5","6"])});
    qs.push({q:"How many months are in a year?", a:"12", choices:shuffle(["12","10","11","6"])});
    qs.push({q:"How many hours are in a day?", a:"24", choices:shuffle(["24","12","30","7"])});
    qs.push({q:"How many legs does a spider have?", a:"8", choices:shuffle(["8","6","4","10"])});
    qs.push({q:"How many wheels does a bicycle have?", a:"2", choices:shuffle(["2","3","4","1"])});
    qs.push({q:"How many legs does a cat have?", a:"4", choices:shuffle(["4","2","6","3"])});
    qs.push({q:"How many eyes do we have?", a:"2", choices:shuffle(["2","1","3","4"])});
    qs.push({q:"How many colors are in a rainbow?", a:"7", choices:shuffle(["7","5","6","8"])});
    qs.push({q:"What comes after 9?", a:"10", choices:shuffle(["10","11","9","8"])});
    qs.push({q:"What comes before 1?", a:"0", choices:shuffle(["0","1","2","-1"])});
    qs.push({q:"How many continents are there?", a:"7", choices:shuffle(["7","5","6","8"])});
    qs.push({q:"How many oceans are there?", a:"5", choices:shuffle(["5","4","6","3"])});
    qs.push({q:"How many letters are in the English alphabet?", a:"26", choices:shuffle(["26","24","25","27"])});
    qs.push({q:"How many months have 31 days?", a:"7", choices:shuffle(["7","6","5","8"])});
    qs.push({q:"How many legs does a dog have?", a:"4", choices:shuffle(["4","2","6","3"])});
    qs.push({q:"How many wheels does a car have?", a:"4", choices:shuffle(["4","2","3","5"])});
    qs.push({q:"How many players are on a football team?", a:"11", choices:shuffle(["11","10","9","12"])});
    qs.push({q:"How many seasons are in a year?", a:"4", choices:shuffle(["4","3","5","6"])});
    qs.push({q:"How many planets are in our solar system?", a:"8", choices:shuffle(["8","7","9","10"])});
    qs.push({q:"How many sides does a triangle have?", a:"3", choices:shuffle(["3","4","5","6"])});
    qs.push({q:"How many sides does a square have?", a:"4", choices:shuffle(["4","3","5","6"])});
    qs.push({q:"How many wheels does a tricycle have?", a:"3", choices:shuffle(["3","2","4","5"])});
    qs.push({q:"How many teeth do humans usually have?", a:"32", choices:shuffle(["32","30","28","36"])});
    qs.push({q:"How many hours in half a day?", a:"12", choices:shuffle(["12","6","24","8"])});
    qs.push({q:"How many days in February (non-leap year)?", a:"28", choices:shuffle(["28","29","30","27"])});
    qs.push({q:"How many sides does a pentagon have?", a:"5", choices:shuffle(["5","4","6","3"])});
    qs.push({q:"How many sides does a hexagon have?", a:"6", choices:shuffle(["6","5","4","7"])});
}
    if(lesson==="Fruits"){
    qs.push({q:"Which is a fruit?", a:"Apple", choices:shuffle(["Apple","Carrot","Potato","Lettuce"])});
    qs.push({q:"Which is yellow and sour?", a:"Lemon", choices:shuffle(["Lemon","Banana","Apple","Mango"])});
    qs.push({q:"Which fruit is tropical and orange inside?", a:"Mango", choices:shuffle(["Mango","Apple","Strawberry","Grapes"])});
    qs.push({q:"Which fruit is small and red?", a:"Strawberry", choices:shuffle(["Strawberry","Apple","Banana","Orange"])});
    qs.push({q:"Which fruit is purple and grows in bunches?", a:"Grapes", choices:shuffle(["Grapes","Plum","Blueberry","Mango"])});
    qs.push({q:"Which fruit is long and yellow?", a:"Banana", choices:shuffle(["Banana","Apple","Orange","Pineapple"])});
    qs.push({q:"Which fruit is green on the outside and red inside?", a:"Watermelon", choices:shuffle(["Watermelon","Apple","Grapes","Mango"])});
    qs.push({q:"Which fruit is round and orange?", a:"Orange", choices:shuffle(["Orange","Mango","Apple","Banana"])});
    qs.push({q:"Which fruit has a spiky skin and yellow inside?", a:"Pineapple", choices:shuffle(["Pineapple","Mango","Banana","Kiwi"])});
    qs.push({q:"Which fruit is small and blue?", a:"Blueberry", choices:shuffle(["Blueberry","Grapes","Plum","Apple"])});
    qs.push({q:"Which fruit is green and often used in salads?", a:"Kiwi", choices:shuffle(["Kiwi","Apple","Banana","Mango"])});
    qs.push({q:"Which fruit is brown and fuzzy outside, green inside?", a:"Kiwi", choices:shuffle(["Kiwi","Coconut","Avocado","Plum"])});
    qs.push({q:"Which fruit is red and often used for juice?", a:"Apple", choices:shuffle(["Apple","Cherry","Tomato","Strawberry"])});
    qs.push({q:"Which fruit is small, round, and red?", a:"Cherry", choices:shuffle(["Cherry","Grape","Strawberry","Apple"])});
    qs.push({q:"Which fruit is orange and small, often peeled easily?", a:"Mandarin", choices:shuffle(["Mandarin","Orange","Peach","Apricot"])});
    qs.push({q:"Which fruit is green and sour?", a:"Lime", choices:shuffle(["Lime","Lemon","Apple","Kiwi"])});
    qs.push({q:"Which fruit is tropical, green outside and orange inside?", a:"Papaya", choices:shuffle(["Papaya","Mango","Pineapple","Banana"])});
    qs.push({q:"Which fruit is red and has tiny seeds outside?", a:"Strawberry", choices:shuffle(["Strawberry","Raspberry","Cherry","Apple"])});
    qs.push({q:"Which fruit is purple and sweet?", a:"Plum", choices:shuffle(["Plum","Grape","Blueberry","Mango"])});
    qs.push({q:"Which fruit is green or purple and grows on vines?", a:"Grapes", choices:shuffle(["Grapes","Plum","Apple","Blueberry"])});
    qs.push({q:"Which fruit is yellow and curved?", a:"Banana", choices:shuffle(["Banana","Lemon","Mango","Apple"])});
    qs.push({q:"Which fruit has a hard shell and white inside?", a:"Coconut", choices:shuffle(["Coconut","Pineapple","Papaya","Avocado"])});
    qs.push({q:"Which fruit is small, orange, and sweet?", a:"Apricot", choices:shuffle(["Apricot","Peach","Mandarin","Mango"])});
    qs.push({q:"Which fruit is tropical, orange inside, and black seeds?", a:"Papaya", choices:shuffle(["Papaya","Mango","Orange","Pineapple"])});
    qs.push({q:"Which fruit is green, smooth, and creamy inside?", a:"Avocado", choices:shuffle(["Avocado","Kiwi","Cucumber","Papaya"])});
    qs.push({q:"Which fruit is red, heart-shaped, and juicy?", a:"Strawberry", choices:shuffle(["Strawberry","Cherry","Apple","Tomato"])});
    qs.push({q:"Which fruit is round, orange or red, fuzzy skin?", a:"Peach", choices:shuffle(["Peach","Apricot","Plum","Mango"])});
    qs.push({q:"Which fruit is sour and green?", a:"Lime", choices:shuffle(["Lime","Lemon","Green Apple","Kiwi"])});
    qs.push({q:"Which fruit is tropical, yellow, and spiky outside?", a:"Pineapple", choices:shuffle(["Pineapple","Mango","Banana","Papaya"])});
    qs.push({q:"Which fruit is tiny, red, and tart?", a:"Raspberry", choices:shuffle(["Raspberry","Cherry","Strawberry","Cranberry"])});
}
  }

  // Filipino Vocabulary
  if(subject==="Filipino Vocabulary"){
if(lesson==="Hayop"){
    qs.push({q:"Ano ang Tagalog ng 'dog'?", a:"Aso", choices:shuffle(["Aso","Pusa","Ibon","Kabayo"])});
    qs.push({q:"Ano ang Tagalog ng 'cat'?", a:"Pusa", choices:shuffle(["Pusa","Aso","Ibon","Baka"])});
    qs.push({q:"Ano ang Tagalog ng 'bird'?", a:"Ibon", choices:shuffle(["Ibon","Aso","Pusa","Baboy"])});
    qs.push({q:"Ano ang Tagalog ng 'cow'?", a:"Baka", choices:shuffle(["Baka","Aso","Pusa","Kabayo"])});
    qs.push({q:"Ano ang Tagalog ng 'horse'?", a:"Kabayo", choices:shuffle(["Kabayo","Aso","Baka","Pusa"])});
    qs.push({q:"Ano ang Tagalog ng 'pig'?", a:"Baboy", choices:shuffle(["Baboy","Aso","Baka","Ibon"])});
    qs.push({q:"Ano ang Tagalog ng 'chicken'?", a:"Manok", choices:shuffle(["Manok","Aso","Pusa","Baka"])});
    qs.push({q:"Ano ang Tagalog ng 'duck'?", a:"Itik", choices:shuffle(["Itik","Aso","Pato","Manok"])});
    qs.push({q:"Ano ang Tagalog ng 'sheep'?", a:"Tupa", choices:shuffle(["Tupa","Aso","Baka","Kabayo"])});
    qs.push({q:"Ano ang Tagalog ng 'goat'?", a:"Kambing", choices:shuffle(["Kambing","Aso","Baka","Tupa"])});
    qs.push({q:"Ano ang Tagalog ng 'elephant'?", a:"Elepante", choices:shuffle(["Elepante","Aso","Kabayo","Baka"])});
    qs.push({q:"Ano ang Tagalog ng 'lion'?", a:"Leon", choices:shuffle(["Leon","Aso","Pusa","Tigre"])});
    qs.push({q:"Ano ang Tagalog ng 'tiger'?", a:"Tigre", choices:shuffle(["Tigre","Leon","Aso","Pusa"])});
    qs.push({q:"Ano ang Tagalog ng 'monkey'?", a:"Unggoy", choices:shuffle(["Unggoy","Aso","Pusa","Ibon"])});
    qs.push({q:"Ano ang Tagalog ng 'rabbit'?", a:"Kuneho", choices:shuffle(["Kuneho","Aso","Pusa","Kabayo"])});
    qs.push({q:"Ano ang Tagalog ng 'bear'?", a:"Oso", choices:shuffle(["Oso","Aso","Leon","Tigre"])});
    qs.push({q:"Ano ang Tagalog ng 'wolf'?", a:"Lobo", choices:shuffle(["Lobo","Aso","Leon","Tigre"])});
    qs.push({q:"Ano ang Tagalog ng 'fox'?", a:"Soro", choices:shuffle(["Soro","Lobo","Aso","Ibon"])});
    qs.push({q:"Ano ang Tagalog ng 'frog'?", a:"Palaka", choices:shuffle(["Palaka","Aso","Ibon","Kuneho"])});
    qs.push({q:"Ano ang Tagalog ng 'snake'?", a:"Ahas", choices:shuffle(["Ahas","Aso","Kabayo","Ibon"])});
    qs.push({q:"Ano ang Tagalog ng 'whale'?", a:"Balyena", choices:shuffle(["Balyena","Isda","Aso","Ibon"])});
    qs.push({q:"Ano ang Tagalog ng 'dolphin'?", a:"Dolphin", choices:shuffle(["Dolphin","Balyena","Isda","Ibon"])});
    qs.push({q:"Ano ang Tagalog ng 'shark'?", a:"Pating", choices:shuffle(["Pating","Isda","Aso","Ibon"])});
    qs.push({q:"Ano ang Tagalog ng 'crab'?", a:"Alimango", choices:shuffle(["Alimango","Hipon","Isda","Aso"])});
    qs.push({q:"Ano ang Tagalog ng 'lobster'?", a:"Lobster", choices:shuffle(["Lobster","Alimango","Hipon","Isda"])});
    qs.push({q:"Ano ang Tagalog ng 'octopus'?", a:"Pugita", choices:shuffle(["Pugita","Hipon","Isda","Aso"])});
    qs.push({q:"Ano ang Tagalog ng 'bee'?", a:"Bubuyog", choices:shuffle(["Bubuyog","Langgam","Aso","Ibon"])});
    qs.push({q:"Ano ang Tagalog ng 'ant'?", a:"Langgam", choices:shuffle(["Langgam","Bubuyog","Aso","Ibon"])});
    qs.push({q:"Ano ang Tagalog ng 'butterfly'?", a:"Paruparo", choices:shuffle(["Paruparo","Langgam","Bubuyog","Ibon"])});
    qs.push({q:"Ano ang Tagalog ng 'fly'?", a:"Langaw", choices:shuffle(["Langaw","Paruparo","Bubuyog","Langgam"])});
}

if(lesson==="Kulay"){
    qs.push({q:"Ano ang kulay ng langit?", a:"Asul", choices:shuffle(["Asul","Pula","Berde","Dilaw"])});
    qs.push({q:"Ano ang kulay ng lemon?", a:"Dilaw", choices:shuffle(["Dilaw","Lila","Kahel","Itim"])});
    qs.push({q:"Ano ang kulay ng damo?", a:"Berde", choices:shuffle(["Berde","Rosas","Puti","Kayumanggi"])});
    qs.push({q:"Ano ang kulay ng mansanas?", a:"Pula", choices:shuffle(["Pula","Asul","Dilaw","Berde"])});
    qs.push({q:"Ano ang kulay ng carrot?", a:"Kahel", choices:shuffle(["Kahel","Pula","Dilaw","Berde"])});
    qs.push({q:"Ano ang kulay ng saging?", a:"Dilaw", choices:shuffle(["Dilaw","Pula","Asul","Berde"])});
    qs.push({q:"Ano ang kulay ng ubas?", a:"Lila", choices:shuffle(["Lila","Berde","Dilaw","Pula"])});
    qs.push({q:"Ano ang kulay ng niyebe?", a:"Puti", choices:shuffle(["Puti","Asul","Itim","Dilaw"])});
    qs.push({q:"Ano ang kulay ng uling?", a:"Itim", choices:shuffle(["Itim","Puti","Asul","Dilaw"])});
    qs.push({q:"Ano ang kulay ng tsokolate?", a:"Kayumanggi", choices:shuffle(["Kayumanggi","Pula","Berde","Itim"])});
    qs.push({q:"Alin sa mga ito ang hindi kulay ng bahaghari?", a:"Itim", choices:shuffle(["Itim","Pula","Asul","Dilaw","Kahel","Berde","Lila"])});
    qs.push({q:"Ano ang unang kulay sa bahaghari?", a:"Pula", choices:shuffle(["Pula","Kahel","Dilaw","Berde"])});
    qs.push({q:"Ano ang huling kulay sa bahaghari?", a:"Lila", choices:shuffle(["Lila","Asul","Dilaw","Pula"])});
    qs.push({q:"Ano ang pangalawang kulay sa bahaghari?", a:"Kahel", choices:shuffle(["Kahel","Dilaw","Pula","Berde"])});
    qs.push({q:"Ano ang pangatlong kulay sa bahaghari?", a:"Dilaw", choices:shuffle(["Dilaw","Kahel","Pula","Berde"])});
    qs.push({q:"Ano ang pang-apat na kulay sa bahaghari?", a:"Berde", choices:shuffle(["Berde","Dilaw","Asul","Pula"])});
    qs.push({q:"Ano ang pang-limang kulay sa bahaghari?", a:"Asul", choices:shuffle(["Asul","Berde","Pula","Kahel"])});
    qs.push({q:"Ano ang pang-anim na kulay sa bahaghari?", a:"Indigo", choices:shuffle(["Indigo","Lila","Asul","Berde"])});
    qs.push({q:"Ano ang pang-pitong kulay sa bahaghari?", a:"Lila", choices:shuffle(["Lila","Indigo","Pula","Kahel"])});
    qs.push({q:"Ano ang pagkakasunod-sunod ng kulay sa bahaghari mula sa itaas pababa?", a:"Pula, Kahel, Dilaw, Berde, Asul, Indigo, Lila", choices:shuffle([
        "Pula, Kahel, Dilaw, Berde, Asul, Indigo, Lila",
        "Lila, Indigo, Asul, Berde, Dilaw, Kahel, Pula",
        "Dilaw, Kahel, Pula, Lila, Indigo, Asul, Berde",
        "Berde, Asul, Indigo, Lila, Pula, Kahel, Dilaw"
    ])});
    qs.push({q:"Ano ang kulay ng rosas?", a:"Pula", choices:shuffle(["Pula","Asul","Dilaw","Berde"])});
    qs.push({q:"Ano ang kulay ng sunflower?", a:"Dilaw", choices:shuffle(["Dilaw","Kahel","Pula","Berde"])});
    qs.push({q:"Ano ang kulay ng dagat?", a:"Asul", choices:shuffle(["Asul","Berde","Puti","Kahel"])});
    qs.push({q:"Ano ang kulay ng abo?", a:"Gray", choices:shuffle(["Gray","Itim","Puti","Kahel"])});
    qs.push({q:"Ano ang kulay ng strawberry?", a:"Pula", choices:shuffle(["Pula","Berde","Dilaw","Kahel"])});
    qs.push({q:"Ano ang kulay ng langit sa dapithapon?", a:"Kahel", choices:shuffle(["Kahel","Pula","Asul","Berde"])});
    qs.push({q:"Ano ang kulay ng uwak?", a:"Itim", choices:shuffle(["Itim","Pula","Berde","Dilaw"])});
    qs.push({q:"Ano ang kulay ng saging na hinog?", a:"Dilaw", choices:shuffle(["Dilaw","Kahel","Berde","Pula"])});
    qs.push({q:"Ano ang kulay ng talong?", a:"Lila", choices:shuffle(["Lila","Kahel","Pula","Berde"])});
    qs.push({q:"Ano ang kulay ng dagat sa umaga?", a:"Asul", choices:shuffle(["Asul","Berde","Kahel","Puti"])});
    qs.push({q:"Ano ang kulay ng kalangitan tuwing gabi?", a:"Itim", choices:shuffle(["Itim","Asul","Pula","Dilaw"])});
}

if(lesson==="Numero"){
    qs.push({q:"Ilan ang daliri sa isang kamay?", a:"5", choices:shuffle(["5","10","4","6"])});
    qs.push({q:"Ilan ang paa ng tao?", a:"2", choices:shuffle(["2","4","3","1"])});
    qs.push({q:"Ilang buwan mayroon sa isang taon?", a:"12", choices:shuffle(["12","10","7","6"])});
    qs.push({q:"Ilang araw mayroon sa isang linggo?", a:"7", choices:shuffle(["7","5","6","8"])});
    qs.push({q:"Ilang itlog mayroon sa isang dosenang itlog?", a:"12", choices:shuffle(["12","10","11","15"])});
    qs.push({q:"Ilang mata mayroon ang tao?", a:"2", choices:shuffle(["2","1","3","4"])});
    qs.push({q:"Ilang gulong mayroon ang isang bisikleta?", a:"2", choices:shuffle(["2","3","4","1"])});
    qs.push({q:"Ilang gulong mayroon ang isang kotse?", a:"4", choices:shuffle(["4","2","3","5"])});
    qs.push({q:"Ilang araw mayroon sa buwan ng Pebrero (hindi leap year)?", a:"28", choices:shuffle(["28","29","30","27"])});
    qs.push({q:"Ilang bituin ang nakikita sa araw-araw sa langit?", a:"Marami", choices:shuffle(["Marami","Isa","Wala","Dalawa"])});
    qs.push({q:"Ilang kulay mayroon sa bahaghari?", a:"7", choices:shuffle(["7","6","8","5"])});
    qs.push({q:"Ilang paa mayroon ang gagamba?", a:"8", choices:shuffle(["8","6","4","10"])});
    qs.push({q:"Ilang sisiw mayroon sa isang manok?", a:"Depende", choices:shuffle(["Depende","5","3","2"])});
    qs.push({q:"Ilang continents mayroon sa mundo?", a:"7", choices:shuffle(["7","5","6","8"])});
    qs.push({q:"Ilang oceans mayroon sa mundo?", a:"5", choices:shuffle(["5","4","6","3"])});
    qs.push({q:"Ilang letra mayroon sa alpabetong Filipino?", a:"28", choices:shuffle(["28","26","30","24"])});
    qs.push({q:"Ilang season mayroon sa isang taon?", a:"4", choices:shuffle(["4","3","5","6"])});
    qs.push({q:"Ilang araw ang Sabado at Linggo sa isang linggo?", a:"2", choices:shuffle(["2","1","3","4"])});
    qs.push({q:"Ilang mata ang karaniwang nakikita sa cartoon na tao?", a:"2", choices:shuffle(["2","1","3","4"])});
    qs.push({q:"Ilang paa ang karaniwang aso?", a:"4", choices:shuffle(["4","2","3","5"])});
    qs.push({q:"Ilang dulo ang mayroon ang tatsulok?", a:"3", choices:shuffle(["3","4","5","6"])});
    qs.push({q:"Ilang gilid ang mayroon ang parisukat?", a:"4", choices:shuffle(["4","3","5","6"])});
    qs.push({q:"Ilang gulong mayroon ang tricycle?", a:"3", choices:shuffle(["3","2","4","5"])});
    qs.push({q:"Ilang ngipin mayroon ang karaniwang tao?", a:"32", choices:shuffle(["32","30","28","36"])});
    qs.push({q:"Ilang oras mayroon sa kalahating araw?", a:"12", choices:shuffle(["12","6","24","8"])});
    qs.push({q:"Ilang araw mayroon sa isang linggo na hindi weekend?", a:"5", choices:shuffle(["5","2","6","4"])});
    qs.push({q:"Ilang oras mayroon sa isang buong araw?", a:"24", choices:shuffle(["24","12","30","6"])});
    qs.push({q:"Ilang taon mayroon sa isang dekada?", a:"10", choices:shuffle(["10","5","12","8"])});
    qs.push({q:"Ilang araw mayroon sa isang taon (karaniwan)?", a:"365", choices:shuffle(["365","360","366","364"])});
    qs.push({q:"Ilang paa mayroon ang pusa?", a:"4", choices:shuffle(["4","2","3","5"])});
}

if(lesson==="Prutas"){
    qs.push({q:"Alin ang prutas?", a:"Mansanas", choices:shuffle(["Mansanas","Karot","Patatas","Lettuce"])});
    qs.push({q:"Aling prutas ay dilaw at maasim?", a:"Lemon", choices:shuffle(["Lemon","Saging","Mansanas","Mango"])});
    qs.push({q:"Aling prutas ay tropikal at kulay kahel sa loob?", a:"Mango", choices:shuffle(["Mango","Mansanas","Strawberry","Ubas"])});
    qs.push({q:"Aling prutas ang kulay pula at maliit?", a:"Strawberry", choices:shuffle(["Strawberry","Mango","Saging","Lemon"])});
    qs.push({q:"Aling prutas ang kulay berde sa labas at pula sa loob?", a:"Pakwan", choices:shuffle(["Pakwan","Mansanas","Lemon","Saging"])});
    qs.push({q:"Aling prutas ang kulay berde at maliit?", a:"Ubas", choices:shuffle(["Ubas","Pakwan","Mango","Saging"])});
    qs.push({q:"Aling prutas ay kulay dilaw at pahaba?", a:"Saging", choices:shuffle(["Saging","Lemon","Mango","Mansanas"])});
    qs.push({q:"Aling prutas ang kulay kahel at matamis?", a:"Kahel na orange", choices:shuffle(["Kahel na orange","Mango","Lemon","Pakwan"])});
    qs.push({q:"Aling prutas ay kulay lila at maliit?", a:"Ubas", choices:shuffle(["Ubas","Mango","Strawberry","Pakwan"])});
    qs.push({q:"Aling prutas ang may balat na makinis at kulay dilaw?", a:"Lemon", choices:shuffle(["Lemon","Mango","Saging","Kahel na orange"])});
    qs.push({q:"Aling prutas ang kulay pula sa loob at may itim na buto?", a:"Pakwan", choices:shuffle(["Pakwan","Mansanas","Lemon","Mango"])});
    qs.push({q:"Aling prutas ang kulay lila sa labas at berde sa loob?", a:"Sinigang na santol", choices:shuffle(["Sinigang na santol","Mango","Ubas","Mansanas"])});
    qs.push({q:"Aling prutas ay karaniwang ginagamit sa salad at kulay pula?", a:"Mansanas", choices:shuffle(["Mansanas","Pakwan","Strawberry","Mango"])});
    qs.push({q:"Aling prutas ang kulay kahel at bilugan?", a:"Kahel na orange", choices:shuffle(["Kahel na orange","Mango","Lemon","Pakwan"])});
    qs.push({q:"Aling prutas ang kulay berde at pahaba?", a:"Saging na hilaw", choices:shuffle(["Saging na hilaw","Mango","Pakwan","Lemon"])});
    qs.push({q:"Aling prutas ay maliit at kulay pula o berde?", a:"Ubas", choices:shuffle(["Ubas","Strawberry","Mango","Lemon"])});
    qs.push({q:"Aling prutas ay kulay pula at bilugan?", a:"Strawberry", choices:shuffle(["Strawberry","Mansanas","Pakwan","Mango"])});
    qs.push({q:"Aling prutas ay kulay dilaw at matamis?", a:"Saging", choices:shuffle(["Saging","Lemon","Kahel na orange","Mango"])});
    qs.push({q:"Aling prutas ay ginagamit sa juice at kulay kahel?", a:"Kahel na orange", choices:shuffle(["Kahel na orange","Mango","Lemon","Pakwan"])});
    qs.push({q:"Aling prutas ay kulay pula at ginagamit sa pie?", a:"Mansanas", choices:shuffle(["Mansanas","Strawberry","Mango","Pakwan"])});
    qs.push({q:"Aling prutas ay kulay berde at malasa sa asim?", a:"Lime", choices:shuffle(["Lime","Lemon","Mango","Pakwan"])});
    qs.push({q:"Aling prutas ay kulay dilaw sa loob at kahel sa balat?", a:"Mango", choices:shuffle(["Mango","Kahel na orange","Lemon","Pakwan"])});
    qs.push({q:"Aling prutas ay kulay lila at matamis?", a:"Ubas", choices:shuffle(["Ubas","Mango","Strawberry","Pakwan"])});
    qs.push({q:"Aling prutas ay maliit at kulay pula o berde sa bunch?", a:"Ubas", choices:shuffle(["Ubas","Strawberry","Mango","Lemon"])});
    qs.push({q:"Aling prutas ay kulay kahel at pabilog?", a:"Kahel na orange", choices:shuffle(["Kahel na orange","Mango","Lemon","Pakwan"])});
    qs.push({q:"Aling prutas ay kulay dilaw at pahaba?", a:"Saging", choices:shuffle(["Saging","Lemon","Mango","Pakwan"])});
    qs.push({q:"Aling prutas ay kulay pula at ginagamit sa jam?", a:"Strawberry", choices:shuffle(["Strawberry","Mansanas","Pakwan","Mango"])});
    qs.push({q:"Aling prutas ay kulay pula sa loob at may maraming buto?", a:"Pakwan", choices:shuffle(["Pakwan","Mansanas","Lemon","Mango"])});
    qs.push({q:"Aling prutas ay kulay berde sa labas at ginagamit sa salad?", a:"Pepino", choices:shuffle(["Pepino","Ubas","Mango","Lemon"])});
    qs.push({q:"Aling prutas ay kulay lila at ginagamit sa wine?", a:"Ubas", choices:shuffle(["Ubas","Mango","Strawberry","Pakwan"])});
}
  }

  return qs;
}

// --- NEW: Philippine History Taglish (3 lessons x 10 questions each) ---
function generatePhilippineHistoryQuestions(lesson){
  const qs = [];
  if(lesson === "Pre-colonial Philippines"){
    qs.push({q:"Anong tawag sa maliit na community noon na pinamumunuan ng datu?", a:"Barangay", choices:shuffle(["Barangay","Provincia","Lungsod","Bayan"])});
    qs.push({q:"Ano ang gamit ng baybayin noon?", a:"Pagsusulat", choices:shuffle(["Pagsusulat","Pagtatanim","Pagluluto","Paglalaba"])});
    qs.push({q:"Sino ang lider ng barangay noon?", a:"Datu", choices:shuffle(["Datu","Prinsipe","Alkalde","Kapitan"])});
    qs.push({q:"Ano ang tawag sa bahay ng mga Pilipino noon na gawa sa nipa at kawayan?", a:"Bahay Kubo", choices:shuffle(["Bahay Kubo","Mansion","Bahay na bato","Casa"])}); 
    qs.push({q:"Anong sining ang kilala noon — sayaw, awit, o pintura?", a:"Sayaw at awit", choices:shuffle(["Sayaw at awit","Pintura","Isports","Surgery"])});
    qs.push({q:"Ano ang tawag sa palitan ng kalakal gamit ang barko o bangka?", a:"Kalakalan", choices:shuffle(["Kalakalan","Pagluluto","Pagtitiis","Pakikipagdigma"])});
    qs.push({q:"Mayroon bang sistema ng batas at tradisyon noon?", a:"Oo", choices:shuffle(["Oo","Hindi","Siguro","Minsan"])});
    qs.push({q:"Anong materyales ang kadalasang ginamit sa paggawa ng kagamitan noon?", a:"Kahoy at kawayan", choices:shuffle(["Kahoy at kawayan","Bakal lang","Plastik","Aluminyo"])});
    qs.push({q:"Anong hayop ang madalas alagaan sa bayan noon para pagkain at trabaho?", a:"Baboy at kalabaw", choices:shuffle(["Baboy at kalabaw","Ibon lang","Isda lang","Tigre"])});
    qs.push({q:"Bakit mahalaga ang oral tradition (kuwento) noon?", a:"Para maipasa ang kaalaman at alamat", choices:shuffle(["Para maipasa ang kaalaman at alamat","Para magtayo ng paaralan","Para magluto","Walang dahilan"])});
  } else if(lesson === "Spanish Colonization"){
    qs.push({q:"Kailan dumating ang mga Espanyol sa Pilipinas (taon)?", a:"1521 (Magellan)", choices:shuffle(["1521 (Magellan)","1600","1400","1800"])});
    qs.push({q:"Sino ang unang dumating na Europeo na nauugnay sa Pilipinas?", a:"Ferdinand Magellan", choices:shuffle(["Ferdinand Magellan","Christopher Columbus","Vasco da Gama","Magellan's cousin"])});
    qs.push({q:"Ano ang ipinakilala ng Espanyol sa edukasyon at relihiyon?", a:"Mga simbahan at paaralan", choices:shuffle(["Mga simbahan at paaralan","Fast food","Trains","Internet"])});
    qs.push({q:"Anong sistema ang nag-organisa ng lupa at buwis noong Kastila?", a:"Encomienda", choices:shuffle(["Encomienda","Democracy","Social Media","Republic"])});
    qs.push({q:"Ano ang nangyari sa kultura ng mga Pilipino dahil sa Kastila?", a:"Napagsama ang tradisyon at bagong gawi", choices:shuffle(["Napagsama ang tradisyon at bagong gawi","Nawala agad","Walang nabago","Lahat umalis"])});
    qs.push({q:"Anong wika ang ipinakilala ng Espanyol pero hindi ito naging pangunahing wika sa buong bansa?", a:"Espanyol", choices:shuffle(["Espanyol","Ingles","Tsino","Hapon"])});
    qs.push({q:"Sino ang isinilang na bayani na sumulat ng Noli Me Tangere noong panahon ng Kastila?", a:"Jose Rizal", choices:shuffle(["Jose Rizal","Andres Bonifacio","Emilio Aguinaldo","Apolinario Mabini"])});
    qs.push({q:"Bakit may mga pag-aalsa laban sa Kastila?", a:"Dahil sa mataas na buwis at hindi makatarungang sistema", choices:shuffle(["Dahil sa mataas na buwis at hindi makatarungang sistema","Dahil sa sobrang saya","Dahil gustong mag-aral","Walang dahilan"])});
    qs.push({q:"Ano ang naging impluwensya ng Kastila sa pagkain at relihiyon?", a:"Adobo, lechon at Katolisismo", choices:shuffle(["Adobo, lechon at Katolisismo","Sinigang lang","Shoe making","Baseball lamang"])});
    qs.push({q:"Paano napasa ang mga bagong salita sa Tagalog mula sa Kastila?", a:"Gamit sa araw-araw na salita", choices:shuffle(["Gamit sa araw-araw na salita","Hindi pumasok","Pagawaan lang","Klasrum lang"])});
  } else if(lesson === "Philippine Revolution"){
    qs.push({q:"Sino ang itinuturing na 'Ama ng Katipunan'?", a:"Andres Bonifacio", choices:shuffle(["Andres Bonifacio","Jose Rizal","Emilio Aguinaldo","Marcelo H. del Pilar"])});
    qs.push({q:"Ano ang Katipunan (Kataas-taasan, Kagalang-galangang Katipunan ng mga Anak ng Bayan)?", a:"Samahan para sa kalayaan", choices:shuffle(["Samahan para sa kalayaan","Paaralan lang","Tindahan","Sports club"])});
    qs.push({q:"Sino ang nagsabing 'Ang hindi marunong lumingon sa pinanggalingan ay hindi makararating sa paroroonan' — karaniwang iniuugnay sa?", a:"Jose Rizal (kontekstong pambansang pagmamahal)", choices:shuffle(["Jose Rizal (kontekstong pambansang pagmamahal)","Andres Bonifacio","Emilio Aguinaldo","Marcelo H. del Pilar"])});
    qs.push({q:"Ano ang naging resulta ng pag-aalsa noong 1896 (mga unang yugto)?", a:"Simula ng rebolusyon at pakikipaglaban", choices:shuffle(["Simula ng rebolusyon at pakikipaglaban","Walang nangyari","Naging pista lang","Naging laro"])});
    qs.push({q:"Sino ang naging unang Pangulo ng Pilipinas na inihayag noong 1899 (short-lived)?", a:"Emilio Aguinaldo", choices:shuffle(["Emilio Aguinaldo","Andres Bonifacio","Jose Rizal","Apolinario Mabini"])});
    qs.push({q:"Bakit mahalaga si Jose Rizal sa panahon ng rebolusyon kahit hindi siya miyembro ng Katipunan?", a:"Kanyang mga akda ang nagmulat ng damdamin ng bayan", choices:shuffle(["Kanyang mga akda ang nagmulat ng damdamin ng bayan","Dahil mahilig siya sa sayaw","Dahil siya'y sundalo","Walang dahilan"])});
    qs.push({q:"Ano ang layunin ng Katipunan?", a:"Palayain ang bansa mula sa Kastila", choices:shuffle(["Palayain ang bansa mula sa Kastila","Magtayo ng tindahan","Mag-aral sa ibang bansa","Magtayo ng paaralan lamang"])});
    qs.push({q:"Saan isinagawa ang sigaw na sumisimbolo sa simula ng armadong pakikibaka (Cry of Pugad Lawin / Balintawak) — anong gawain ang sinasabing ginawa?", a:"Pagsunog ng cedulas (mga papeles) o pag-alis ng mga tanda", choices:shuffle(["Pagsunog ng cedulas (mga papeles) o pag-alis ng mga tanda","Pagtitimpla ng kape","Pagtugtog ng piano","Pagbili ng tinapay"])});
    qs.push({q:"Ano ang natutunan natin mula sa panahon ng rebolusyon?", a:"Ang tapang at pagkakaisa para sa kalayaan", choices:shuffle(["Ang tapang at pagkakaisa para sa kalayaan","Walang natutunan","Pumunta sa ibang bansa","Maglaro lang"])});
    qs.push({q:"Bakit mahalaga ituro ang kasaysayan sa mga bata (Taglish answer)?", a:"Para malaman nila kung saan sila nagmula at mahalin ang bayan", choices:shuffle(["Para malaman nila kung saan sila nagmula at mahalin ang bayan","Para lang gumamit ng libro","Para mag-aral ng math","Walang gamit"])});
  }
  return qs;
}

// Sound effects
const sfx = {
  correct: new Audio("sounds/correct.mp3"),
  wrong: new Audio("sounds/wrong.mp3"),
  bronze: new Audio("sounds/bronze.mp3"),
  silver: new Audio("sounds/silver.mp3"),
  gold: new Audio("sounds/gold.mp3"),
  diamond: new Audio("sounds/diamond.mp3")
};

let bleDevice, bleCharacteristic;

// Connect to ESP32 BLE
async function connectESP32() {
  try {
    bleDevice = await navigator.bluetooth.requestDevice({
      filters: [{ name: "ISIP_BATA_Controller" }],
      optionalServices: ["12345678-1234-1234-1234-1234567890ab"]
    });

    const server = await bleDevice.gatt.connect();
    const service = await server.getPrimaryService("12345678-1234-1234-1234-1234567890ab");
    bleCharacteristic = await service.getCharacteristic("87654321-4321-4321-4321-0987654321ba");

    bleCharacteristic.startNotifications();
    bleCharacteristic.addEventListener("characteristicvaluechanged", handleBLEInput);
    alert("✅ ESP32 Connected!");
  } catch (err) {
    alert("⚠️ Connection failed: " + err);
  }
}

// Read button commands from ESP32
function handleBLEInput(event) {
  const val = new TextDecoder().decode(event.target.value);
  if (val === "U") moveHighlight(-1);
  if (val === "D") moveHighlight(1);
  if (val === "S") selectHighlighted();
}

// Control LEDs from app
async function setLED(correct) {
  if (!bleCharacteristic) return;
  const data = new TextEncoder().encode(correct ? "G" : "R");
  await bleCharacteristic.writeValue(data);
}

// === QUIZ LOGIC with ESP32 BLE CONTROL ===
function startQuiz(subject, lesson) {
  quizSessionId++;
  const mySession = quizSessionId;
  const quizContainer = document.getElementById("quizContainer");
  quizContainer.innerHTML = "";
  document.getElementById("folkloreContainer").classList.add("hidden");

  const pool = generateQuestionPool(subject, lesson);
  const quizSet = (Array.isArray(pool) && pool.length)
    ? shuffle(pool).slice(0, Math.min(pool.length, Math.floor(Math.random() * 6) + 5))
    : [{ q: "No questions available", a: "", choices: ["Ok"] }];

  let current = 0,
    score = 0,
    selectedIndex = 0;

  function showQuestion() {
    if (mySession !== quizSessionId) return;
    quizContainer.innerHTML = `<h4>Q${current + 1}: ${quizSet[current].q}</h4>`;
    const choicesEl = document.createElement("div");
    choicesEl.className = "choices";
    quizContainer.appendChild(choicesEl);

    quizSet[current].choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.innerText = choice;
      btn.classList.add("quiz-choice");
      if (i === 0) btn.classList.add("highlighted");
      btn.onclick = () => handleAnswer(i, choice);
      choicesEl.appendChild(btn);
    });

    selectedIndex = 0;
  }

  // Move highlight up/down via ESP32
  function moveHighlight(dir) {
    const buttons = document.querySelectorAll(".quiz-choice");
    if (!buttons.length) return;
    buttons[selectedIndex].classList.remove("highlighted");
    selectedIndex = (selectedIndex + dir + buttons.length) % buttons.length;
    buttons[selectedIndex].classList.add("highlighted");
  }

  // Select highlighted button
  function selectHighlighted() {
    const buttons = document.querySelectorAll(".quiz-choice");
    if (!buttons.length) return;
    buttons[selectedIndex].click();
  }

  // Handle answer check
  function handleAnswer(index, choice) {
    const buttons = document.querySelectorAll(".quiz-choice");
    if (choice === quizSet[current].a) {
      buttons[index].classList.add("correct");
      score++;
      sfx.correct.currentTime = 0;
      sfx.correct.play();
      sendToESP32("CORRECT"); // 🟢 Light green LED
    } else {
      buttons[index].classList.add("wrong");
      sfx.wrong.currentTime = 0;
      sfx.wrong.play();
      sendToESP32("WRONG"); // 🔴 Light red LED
    }

    Array.from(buttons).forEach(b => (b.disabled = true));

    setTimeout(() => {
      current++;
      if (current < quizSet.length) showQuestion();
      else finishQuiz();
    }, 700);
  }

  // Finish quiz and show certificate
  function finishQuiz() {
    alert(`You scored ${score} out of ${quizSet.length}`);
    const percent = (score / quizSet.length) * 100;

    if (!users[currentUser].completions[lesson]) users[currentUser].completions[lesson] = 0;
    users[currentUser].completions[lesson]++;
    users[currentUser].lessonsCompleted++;
    users[currentUser].scores.push(score);

    if (percent >= 65) {
      let badge = getBadgeLevel(users[currentUser].completions[lesson]);
      users[currentUser].badges.push(`${lesson}: ${badge}`);
      users[currentUser].certificates.push(`${lesson} - ${badge}`);
      showCertificate(currentUser, lesson, badge);
    }

    localStorage.setItem("users", JSON.stringify(users));
  }

  // Listen for ESP32 BLE button input
  if (bleCharacteristic) {
    bleCharacteristic.removeEventListener("characteristicvaluechanged", handleBLEInput);
    bleCharacteristic.addEventListener("characteristicvaluechanged", handleBLEInput);
  }

  function handleBLEInput(event) {
    const val = new TextDecoder().decode(event.target.value);
    if (val === "U") moveHighlight(-1);
    if (val === "D") moveHighlight(1);
    if (val === "S") selectHighlighted();
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

if (percent >= 65) {
  let badge = getBadgeLevel(users[currentUser].completions[lesson]);
  users[currentUser].badges.push(`${lesson}: ${badge}`);
  users[currentUser].certificates.push(`${lesson} - ${badge}`);
  showCertificate(currentUser, lesson, badge);

  // 🏅 Play badge sound
  if (badge.toLowerCase().includes("diamond")) {
    sfx.diamond.play();
  } else if (badge.toLowerCase().includes("gold")) {
    sfx.gold.play();
  } else if (badge.toLowerCase().includes("silver")) {
    sfx.silver.play();
  } else {
    sfx.bronze.play();
  }
}
function handleButtonPress(value) {
  // Handles A-D choices or BACK
  const choicesEl = document.querySelector(".choices");
  if (!choicesEl) return;

  const btns = Array.from(choicesEl.children);
  if (value === "BACK") {
    // Go home
    document.getElementById("quizContainer").classList.add("hidden");
    document.getElementById("homeContainer").classList.remove("hidden");
    sendToESP32("RESET");
    return;
  }

  const map = { "A": 0, "B": 1, "C": 2, "D": 3 };
  const i = map[value];
  if (i === undefined || i >= btns.length) return;

  const btn = btns[i];
  btn.click(); // Simulate the click!
}

    localStorage.setItem("users", JSON.stringify(users));

    // --- Show random folklore story for fun ---
    const folkloreContainer=document.getElementById("folkloreContainer");
    const folkloreStories = [
      "Legend of Mariang Makiling",
      "The Monkey and the Turtle",
      "Alamat ng Pinya",
      "Alamat ng Rosas",
      "The Tale of Juan Tamad",
      "Alamat ng Bahaghari",
      "The Talking Bird"
    ];
    folkloreContainer.innerHTML=`<h4>Random Folklore Story:</h4><p>${folkloreStories[Math.floor(Math.random()*folkloreStories.length)]}</p>`;
    folkloreContainer.classList.remove("hidden");
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

// Certificate (show UI) - offline-safe
function showCertificate(user, lesson, badge){
  const cert = document.getElementById("certificatePage");
  cert.classList.remove("hidden");
  cert.style.display = "block";
  document.getElementById("certName").innerText = users[user].fullName || "Student";
  document.getElementById("certLesson").innerText = lesson;
  document.getElementById("certBadge").innerText = badge || "";

  // Check online status: if offline, hide download button (no crash)
  const downloadBtn = document.getElementById("downloadBtn");
  if(typeof navigator !== "undefined" && navigator.onLine === false){
    downloadBtn.style.display = "none";
  } else {
    downloadBtn.style.display = "inline-block";
  }

  // Scroll into view
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

// DOWNLOAD Certificate as PNG (works when online)
// If offline, we'll gracefully prevent download and keep certificate visible.
 function downloadCertificate() {
  const name = document.getElementById("certName").innerText || "Student";
  const lesson = document.getElementById("certLesson").innerText || "Lesson";
  const badge = document.getElementById("certBadge")?.innerText || "";

  const canvas = document.getElementById("certCanvas");
  const ctx = canvas.getContext("2d");

  // Draw background gradient (landscape)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  g.addColorStop(0, "#fffaf0");
  g.addColorStop(1, "#f0f7ff");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = "#f2c94c";
  ctx.lineWidth = 12;
  roundRect(ctx, 30, 30, canvas.width - 60, canvas.height - 60, 30, false, true);

  // Confetti (soft pastel circles)
  for (let i = 0; i < 80; i++) {
    const cx = Math.random() * (canvas.width - 140) + 70;
    const cy = Math.random() * (canvas.height - 260) + 70;
    const r = Math.random() * 7 + 2;
    ctx.beginPath();
    ctx.fillStyle = randomPastel();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Texts
  ctx.fillStyle = "#2b6a86";
  ctx.font = "52px 'Poppins', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Certificate of Completion", canvas.width / 2, 160);

  ctx.fillStyle = "#2b7a78";
  ctx.font = "64px 'Great Vibes', cursive";
  ctx.fillText("You Did Amazing!", canvas.width / 2, 240);

  ctx.fillStyle = "#0b4b6b";
  ctx.font = "48px 'Poppins', sans-serif";
  ctx.fillText(name, canvas.width / 2, 360);

  ctx.font = "30px 'Poppins', sans-serif";
  ctx.fillText(`For successfully completing: ${lesson}`, canvas.width / 2, 420);

  if (badge) {
    ctx.fillStyle = "#ff7043";
    ctx.font = "26px 'Poppins', sans-serif";
    ctx.fillText(`Badge earned: ${badge}`, canvas.width / 2, 470);
  }

  ctx.fillStyle = "#555";
  ctx.font = "20px 'Poppins', sans-serif";
  ctx.fillText(
    "ISIP BATA — Keep learning, keep shining ✨",
    canvas.width / 2,
    canvas.height - 120
  );

  // ✅ Safe behavior
  if (!navigator.onLine) {
    // Offline — just preview, no download
    alert("Offline ka ngayon 🌙. Screenshot mo muna ang certificate mo!");
    return;
  }

  // Online — try download safely
  try {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    const safeName = name.replace(/\s+/g, "_").replace(/[^\w\-]/g, "");
    const safeLesson = lesson.replace(/\s+/g, "_").replace(/[^\w\-]/g, "");
    link.download = `${safeName}_${safeLesson}_Certificate.png`;
    link.click();
  } catch (e) {
    // fallback: open in new tab for manual save
    window.open(canvas.toDataURL("image/png"), "_blank");
  }
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
  if(!el) return;
  el.style.transition = "transform 260ms ease, opacity 260ms ease";
  el.style.transform = "translateY(8px)";
  el.style.opacity = "0";
  requestAnimationFrame(()=> {
    el.style.transform = "translateY(0)";
    el.style.opacity = "1";
  });
}

window.addEventListener("load", async () => {
  if (!navigator.bluetooth || !navigator.bluetooth.getDevices) return;
  const devices = await navigator.bluetooth.getDevices();
  for (const device of devices) {
    if (device.name === "ISIP_BATA_Controller") {
      try {
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService("12345678-1234-1234-1234-1234567890ab");
        bleCharacteristic = await service.getCharacteristic("87654321-4321-4321-4321-0987654321ba");
        await bleCharacteristic.startNotifications();
        bleCharacteristic.addEventListener("characteristicvaluechanged", handleBLEInput);
        const btn = document.getElementById("connectESPBtn");
        btn.innerText = "🟢 ESP32 Connected";
        btn.style.backgroundColor = "#28a745";
        break;
      } catch (e) {
        console.warn("Auto-connect failed", e);
      }
    }
  }
});

async function connectESP32() {
  const btn = document.getElementById("connectESPBtn");

  if (!navigator.bluetooth) {
    alert("⚠️ Bluetooth not supported on this browser or device.");
    return;
  }

  try {
    btn.disabled = true;
    btn.innerText = "⏳ Connecting...";
    
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ name: "ISIP_BATA_Controller" }],
      optionalServices: ["12345678-1234-1234-1234-1234567890ab"]
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService("12345678-1234-1234-1234-1234567890ab");
    bleCharacteristic = await service.getCharacteristic("87654321-4321-4321-4321-0987654321ba");

    await bleCharacteristic.startNotifications();
    bleCharacteristic.addEventListener("characteristicvaluechanged", handleBLEInput);

    alert("✅ ESP32 successfully connected!");
    btn.innerText = "🟢 ESP32 Connected";
    btn.style.backgroundColor = "#28a745";
  } catch (err) {
    alert("❌ Connection failed: " + err.message);
    btn.innerText = "🔌 Connect ESP32";
  } finally {
    btn.disabled = false;
  }
}







