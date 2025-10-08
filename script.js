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
  "Filipino Vocabulary":["Hayop","Kulay","Numero","Prutas"],
  // Added Philippine History lessons
  "Philippine History":["Pre-Colonial","Spanish Colonization","Philippine Revolution","American Period","Japanese Occupation","Post-War"]
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
  } else if(subject === "Philippine History"){
    // For each history topic, build 30 Qs (simple, age-appropriate)
    if(lesson === "Pre-Colonial"){
      questions.push(
        {q:"What did many early Filipinos use to travel between islands?", a:"Bangka (boat)", choices:shuffle(["Bangka (boat)","Train","Car","Airplane"])},
        {q:"What did early Filipinos use to make huts and houses?", a:"Nipa and bamboo", choices:shuffle(["Nipa and bamboo","Concrete and steel","Brick and mortar","Glass"])},
        {q:"What kind of trade did pre-colonial Filipinos do?", a:"Sea trade with neighbors", choices:shuffle(["Sea trade with neighbors","Space trade","Trade only within village","Internet trade"])},
        {q:"What were leaders of barangays called?", a:"Datu", choices:shuffle(["Datu","Mayor","President","King"])},
        {q:"Which writing system did some pre-colonial Filipinos use?", a:"Baybayin", choices:shuffle(["Baybayin","Latin alphabet","Cyrillic","Chinese characters"])},
        {q:"What did early Filipinos often make from shells and bones?", a:"Jewelry", choices:shuffle(["Jewelry","Electronic devices","Books","Glassware"])},
        {q:"What was a common craft in pre-colonial Philippines?", a:"Weaving", choices:shuffle(["Weaving","Car manufacturing","Computer programming","Metal smelting"])},
        {q:"What did early Filipinos grow for food?", a:"Rice", choices:shuffle(["Rice","Wheat","Corn only","Potatoes only"])},
        {q:"Which animal was important for fishing?", a:"Boat with nets", choices:shuffle(["Boat with nets","Camel","Reindeer","Elephant"])},
        {q:"What did some communities use to protect themselves?", a:"Fortified villages", choices:shuffle(["Fortified villages","Tall skyscrapers","Metal fences only","Castles with moats"])},
        {q:"What activity was common at the seashore for food?", a:"Gathering shellfish", choices:shuffle(["Gathering shellfish","Mining coal","Skiing","Ice fishing"])},
        {q:"What were early Filipinos known to be skilled at?", a:"Sailing and navigation", choices:shuffle(["Sailing and navigation","Rocket science","Automobile racing","Ski jumping"])},
        {q:"What did barangays often base decisions on?", a:"Customs and elders' advice", choices:shuffle(["Customs and elders' advice","Online polls","Newspapers","Television"])},
        {q:"What was the role of the babaylan in many communities?", a:"Healer and spiritual leader", choices:shuffle(["Healer and spiritual leader","Banker","Pilot","Mechanic"])},
        {q:"Where did many pre-colonial people get their food?", a:"Sea, farms and forests", choices:shuffle(["Sea, farms and forests","Supermarkets only","Factory farms","Import only"])},
        {q:"What did early Filipino traders bring from other lands?", a:"Spices and goods", choices:shuffle(["Spices and goods","Computers","Cars","Airplanes"])},
        {q:"What simple tool helped in farming?", a:"Wooden plow or hoe", choices:shuffle(["Wooden plow or hoe","Tractor","Combine harvester","Robot"])},
        {q:"Which craft created baskets and mats?", a:"Weaving and rattan craft", choices:shuffle(["Weaving and rattan craft","Glassblowing","Metal forging","Electronics assembly"])},
        {q:"What element helped villages when raining season came?", a:"Rice terraces and irrigation", choices:shuffle(["Rice terraces and irrigation","Air conditioning","Subways","Dams only"])},
        {q:"What did trading villages often exchange?", a:"Food, cloth, pottery", choices:shuffle(["Food, cloth, pottery","Movies, apps, songs","Space parts","Automobiles only"])},
        {q:"Which body of water was important for pre-colonial trade?", a:"The seas around the islands", choices:shuffle(["The seas around the islands","The Amazon River","Atlantic Ocean only","Pacific Ocean only"])},
        {q:"What is a 'barangay'?", a:"A small community or village", choices:shuffle(["A small community or village","A type of ship","A government building","A festival"])},
        {q:"Who helped lead and protect the barangay?", a:"Datu", choices:shuffle(["Datu","Teacher","Banker","Doctor"])},
        {q:"What would early Filipinos often catch for food?", a:"Fish", choices:shuffle(["Fish","Penguins","Polar bears","Kangaroos"])},
        {q:"What was an important material used for cooking pots?", a:"Clay pottery", choices:shuffle(["Clay pottery","Plastic only","Glass only","Steel only"])},
        {q:"What did Baybayin represent?", a:"Syllables and sounds", choices:shuffle(["Syllables and sounds","Modern code","Numbers only","Mathematics formulas"])},
        {q:"What skill helped island travel and trade?", a:"Boat-building", choices:shuffle(["Boat-building","Car-building","Plane-building","Computer-making"])},
        {q:"Who kept oral stories and histories?", a:"Elders and storytellers", choices:shuffle(["Elders and storytellers","Robots","TV anchors","Shopkeepers"])},
        {q:"What did barter mean in early trade?", a:"Exchange goods without money", choices:shuffle(["Exchange goods without money","Pay with credit card","Online transfer","Pay with coins only"])}
      );
    }
    else if(lesson === "Spanish Colonization"){
      questions.push(
        {q:"When did Spanish colonization of the Philippines begin (approx.)?", a:"1521 (Magellan's visit) / 1565 Spanish settlement", choices:shuffle(["1521 / 1565","1901","1898","1942"])},
        {q:"Who led the first Spanish expedition to the Philippines?", a:"Ferdinand Magellan", choices:shuffle(["Ferdinand Magellan","Christopher Columbus","Magna Carta","Amerigo Vespucci"])},
        {q:"What religion spread widely during Spanish rule?", a:"Roman Catholicism", choices:shuffle(["Roman Catholicism","Buddhism","Islam only","Hinduism"])},
        {q:"What was the Spanish system of forced labor called?", a:"Polo y servicio", choices:shuffle(["Polo y servicio","Encomienda","Feudalism","Indenture only"])},
        {q:"What crop became important under Spanish rule?", a:"Sugar and tobacco", choices:shuffle(["Sugar and tobacco","Corn only","Potatoes only","Bananas only"])},
        {q:"What was a Spanish settlement called?", a:"Provincia / Pueblo", choices:shuffle(["Provincia / Pueblo","Township","County","Province as used today only"])},
        {q:"What structure did Spaniards build in towns?", a:"Church and plaza", choices:shuffle(["Church and plaza","Skyscrapers","Factories","Shopping malls"])},
        {q:"What is 'Galleon Trade'?", a:"Trade between Manila and Acapulco", choices:shuffle(["Trade between Manila and Acapulco","Trade with China only","Trade with Australia","Space trade"])},
        {q:"Which Spanish policy affected land ownership?", a:"Encomienda and friar lands", choices:shuffle(["Encomienda and friar lands","Free land to all","Urbanization policy","Industrialization only"])},
        {q:"Who were the ilustrados?", a:"Educated Filipino reformers", choices:shuffle(["Educated Filipino reformers","Spanish soldiers","American teachers","Japanese officials"])},
        {q:"Which language became official during Spain's rule?", a:"Spanish (in government and church)", choices:shuffle(["Spanish (in government and church)","English only","Tagalog only","Baybayin only"])},
        {q:"What were 'friar' lands?", a:"Church-owned lands", choices:shuffle(["Church-owned lands","Public parks","Market stalls","Train stations"])},
        {q:"Who wrote about reforms and Filipino rights under Spain?", a:"Jose Rizal and other reformers", choices:shuffle(["Jose Rizal and other reformers","Magellan","Washington","Napoleon"])},
        {q:"What school system did Spain establish?", a:"Religious schools (parochial)", choices:shuffle(["Religious schools (parochial)","Free public modern schools","Universities only in Asia","Online schools"])},
        {q:"Which family group often ruled local towns under Spain?", a:"Local elite and gobernadorcillos", choices:shuffle(["Local elite and gobernadorcillos","Kings","Presidents","Tribal councils only"])},
        {q:"Where were many Spanish forts and towns built?", a:"Coastal and central towns", choices:shuffle(["Coastal and central towns","Mountaintops only","Deep forests only","Deserts only"])},
        {q:"What was a negative effect of colonization?", a:"Loss of land and forced labor", choices:shuffle(["Loss of land and forced labor","Better roads only","No change","Universal wealth"])},
        {q:"What did Spanish missionaries often build in towns?", a:"Churches and convents", choices:shuffle(["Churches and convents","Factories","Airports","Power plants"])},
        {q:"Which crop was shipped to Spain and other places?", a:"Sugar", choices:shuffle(["Sugar","Rice","Cheese","Wine only"])},
        {q:"Which group sometimes resisted Spanish rule?", a:"Local revolts and uprisings", choices:shuffle(["Local revolts and uprisings","No resistance","Alliance with Spain","Foreign invaders only"])},
        {q:"What event inspired Filipino nationalism under Spain?", a:"The Propaganda Movement and reform writings", choices:shuffle(["The Propaganda Movement and reform writings","Industrial revolution in Europe","Sports","Agriculture only"])},
        {q:"Who was a Filipino martyr executed by Spanish authorities?", a:"Jose Rizal (executed 1896)", choices:shuffle(["Jose Rizal (executed 1896)","Magellan","Ateneo founder","Washington"])},
        {q:"What was the role of Spanish government in the islands?", a:"Governor-General ruled the colony", choices:shuffle(["Governor-General ruled the colony","President of Philippines","Prime Minister","King of England"])},
        {q:"What was often the center of a Spanish town?", a:"Plaza with church and government house", choices:shuffle(["Plaza with church and government house","Shopping mall","Train station","Sports arena"])},
        {q:"Which groups benefited most under Spanish rule?", a:"Spanish officials and local elites", choices:shuffle(["Spanish officials and local elites","All peasants","Factory workers only","Students only"])},
        {q:"What kind of legal system did Spain introduce?", a:"Spanish colonial laws and decrees", choices:shuffle(["Spanish colonial laws and decrees","Modern democracy immediately","Sharia law only","None"])},
        {q:"What is one cultural legacy of Spain in the Philippines?", a:"Catholic festivals and many Spanish loanwords", choices:shuffle(["Catholic festivals and many Spanish loanwords","No changes","Japanese language","American football only"])},
        {q:"Which year roughly marks the end of major Spanish rule due to the revolution?", a:"1898 (Treaty of Paris / Philippine Revolution events)", choices:shuffle(["1898","1945","1565","1901"])},
        {q:"What was the Cavite Mutiny (1872) important for?", a:"Sparked Spanish suspicion and repression", choices:shuffle(["Sparked Spanish suspicion and repression","Started American rule","Started Japanese rule","Started trade only"]) }
      );
    }
    else if(lesson === "Philippine Revolution"){
      questions.push(
        {q:"When did the Philippine Revolution against Spain begin (officially)?", a:"1896", choices:shuffle(["1896","1521","1941","1901"])},
        {q:"What was the name of the secret society that started the revolution?", a:"Katipunan (KKK)", choices:shuffle(["Katipunan (KKK)","Ilustrado Club","Galleon Group","Revolutionary Party"])},
        {q:"Who is called the father of the Philippines' revolution?", a:"Andrés Bonifacio (founder of Katipunan)", choices:shuffle(["Andrés Bonifacio (founder of Katipunan)","Ferdinand Magellan","Jose Rizal only","Emilio Aguinaldo only"])},
        {q:"Who became the first President of the Philippine Revolutionary Government?", a:"Emilio Aguinaldo", choices:shuffle(["Emilio Aguinaldo","Andrés Bonifacio","Jose Rizal","Antonio Luna"])},
        {q:"What is the significance of the Cry of Pugad Lawin / Balintawak?", a:"Start of open revolution (shredding of cedulas)", choices:shuffle(["Start of open revolution (shredding of cedulas)","A trade event","A harvest festival","A treaty signing"])},
        {q:"Who wrote Noli Me Tangere and influenced reformers?", a:"Jose Rizal", choices:shuffle(["Jose Rizal","Andres Bonifacio","Emilio Aguinaldo","Antonio Luna"])},
        {q:"What did revolutionaries want from Spain?", a:"Independence and reforms", choices:shuffle(["Independence and reforms","More taxes","More trade only","To remain colony"])},
        {q:"Where was the Declaration of Philippine Independence proclaimed (1898)?", a:"Cavite (June 12, 1898 — Kawit, Cavite)", choices:shuffle(["Kawit, Cavite (June 12, 1898)","Manila","Luzon only","Cebu only"])},
        {q:"What flag was first waved in the declaration of independence?", a:"The Philippine Flag (designed by Emilio Aguinaldo's group)", choices:shuffle(["The Philippine Flag","Spanish flag","American flag","Japanese flag"])},
        {q:"Which battle was a major sea victory by Filipino forces?", a:"Battle of Alapan (or other local engagements)", choices:shuffle(["Battle of Alapan","Battle of Trafalgar","Battle of Waterloo","Battle of Midway"])},
        {q:"Which leader later had conflict with Bonifacio and replaced him?", a:"Emilio Aguinaldo", choices:shuffle(["Emilio Aguinaldo","Jose Rizal","Andres Bonifacio","Apolinario Mabini"])},
        {q:"What happened to Andres Bonifacio?", a:"He was arrested and executed (controversially)", choices:shuffle(["He was arrested and executed (controversially)","He became president","He went abroad","He lived quietly"])},
        {q:"Which 1898 event changed colonial rulers in the Philippines?", a:"Spanish-American War and Treaty of Paris", choices:shuffle(["Spanish-American War and Treaty of Paris","World War I","World War II","Seven Years' War"])},
        {q:"What was the Malolos Republic?", a:"First Philippine Republic established in 1899", choices:shuffle(["First Philippine Republic (Malolos)","Spanish colony reorganized","American state","Japanese puppet state"])},
        {q:"Who was a famous Filipino general in the revolutionary army?", a:"Antonio Luna", choices:shuffle(["Antonio Luna","Jose Rizal","Magellan","Quezon"])},
        {q:"Why is June 12 important in Philippine history?", a:"Philippine Independence Day (from Spain, 1898)", choices:shuffle(["Philippine Independence Day (from Spain, 1898)","Start of American rule","Start of World War II","A harvest day"])},
        {q:"What ended Spanish colonial control in the Philippines?", a:"Treaty of Paris (1898) transferring control to the U.S.", choices:shuffle(["Treaty of Paris (1898)","Malolos Constitution","Japanese attack","Local election"])},
        {q:"Which was a challenge for revolutionaries after independence declaration?", a:"Recognition and conflict with the U.S.", choices:shuffle(["Recognition and conflict with the U.S.","No problems","Worldwide support","Immediate peace"])},
        {q:"What role did the Katipunan play?", a:"Organized armed resistance", choices:shuffle(["Organized armed resistance","Trade union only","Religious group","School"])},
        {q:"Who served as a key adviser to Aguinaldo's government?", a:"Apolinario Mabini", choices:shuffle(["Apolinario Mabini","Antonio Luna","Magellan","Bonifacio"])},
        {q:"What did the Malolos Constitution aim to create?", a:"A republican government for the Philippines", choices:shuffle(["A republican government for the Philippines","A monarchy","A theocracy","A federation with Spain"])},
        {q:"Which year did the First Philippine Republic (Malolos) form?", a:"1899", choices:shuffle(["1899","1521","1901","1945"])},
        {q:"What major problem did the revolution face against the U.S.?", a:"Armed conflict and eventual U.S. occupation", choices:shuffle(["Armed conflict and eventual U.S. occupation","Economic surplus","No resistance","Instant recognition"])},
        {q:"Which leader later became a controversial figure after the revolution?", a:"Emilio Aguinaldo", choices:shuffle(["Emilio Aguinaldo","Jose Rizal","Magellan","Apolinario Mabini"])},
        {q:"What was one result of the revolution era?", a:"A move toward Filipino self-rule and later conflict with U.S.", choices:shuffle(["A move toward Filipino self-rule and later conflict with U.S.","Complete independence in 1899 only","Colonization by Japan","Separation into islands only"])},
        {q:"What was the significance of the Philippine Revolution overall?", a:"It started the modern movement for nationhood", choices:shuffle(["It started the modern movement for nationhood","It ended all wars","It created world peace","It industrialized the islands"])},
        {q:"What happened to the Malolos Republic?", a:"It struggled due to war with the U.S.", choices:shuffle(["It struggled due to war with the U.S.","It became a stable state","It became colony of Japan","It lasted 100 years"])}
      );
    }
    else if(lesson === "American Period"){
      questions.push(
        {q:"When did American rule begin in the Philippines (approx.)?", a:"1898–1901 period following Spanish-American War", choices:shuffle(["1898–1901","1521","1941","1945"])},
        {q:"What language was introduced widely during the American period?", a:"English", choices:shuffle(["English","Spanish only","Japanese","Baybayin only"])},
        {q:"What system did Americans introduce for education?", a:"Public school system with English instruction", choices:shuffle(["Public school system with English instruction","No schools","Only religious schools","Online schools"])},
        {q:"Which event marked the resistance against U.S. occupation?", a:"Philippine-American War", choices:shuffle(["Philippine-American War","World War II","Spanish-American War only","Revolution only"])},
        {q:"Which civic structure was installed by Americans?", a:"Civil government and local elections", choices:shuffle(["Civil government and local elections","Monarchy","No government","Only military rule forever"])},
        {q:"What improvements did Americans build in the islands?", a:"Roads, public health, and schools", choices:shuffle(["Roads, public health, and schools","Skyscrapers only","Spaceports","Malls only"])},
        {q:"What system replaced some Spanish institutions?", a:"Civil institutions and public education", choices:shuffle(["Civil institutions and public education","More friar lands","Feudalism again","No change"])},
        {q:"Who were the first Filipino senators under American setup?", a:"Filipino political leaders in early assemblies", choices:shuffle(["Filipino political leaders in early assemblies","Spanish nobles","American-only senators","Japanese officials"])},
        {q:"What law promised more autonomy over time?", a:"Philippine Autonomy Acts (Jones Act 1916)", choices:shuffle(["Jones Act (1916)","Treaty of Paris","Galleon Act","None"])},
        {q:"What led to increased Filipino political participation?", a:"Elections and local government reforms", choices:shuffle(["Elections and local government reforms","No participation","Forced labor only","No voting rights"])},
        {q:"Which health measure helped Filipinos during American rule?", a:"Public health campaigns and hospitals", choices:shuffle(["Public health campaigns and hospitals","No hospitals","Only magic remedies","Factories"])},
        {q:"What economic change happened under the Americans?", a:"More commercial agriculture and trade", choices:shuffle(["More commercial agriculture and trade","Complete industrialization","No change","Only fishing economy"])},
        {q:"Which year did the U.S. promise future independence (Tydings–McDuffie Act)?", a:"1934 (Tydings–McDuffie Act set path to commonwealth)", choices:shuffle(["1934","1898","1946","1901"])},
        {q:"What was the Commonwealth period?", a:"Transitional self-government (1935–1946)", choices:shuffle(["Transitional self-government (1935–1946)","Colonial Spain period","Japanese puppet state","Immediate independence"])},
        {q:"Which president led the Commonwealth?", a:"Manuel L. Quezon", choices:shuffle(["Manuel L. Quezon","Jose Rizal","Andres Bonifacio","Emilio Aguinaldo"])},
        {q:"What was a cultural influence of Americans?", a:"English language, public education, and popular culture", choices:shuffle(["English language, public education, and popular culture","Only Spanish songs","Only Baybayin writing","No cultural exchange"])},
        {q:"Which war disrupted American-era plans for independence?", a:"World War II (Japanese invasion)", choices:shuffle(["World War II (Japanese invasion)","Spanish-American War again","Cold War only","No war"])},
        {q:"What did Americans build to help trade?", a:"Ports and transport infrastructure", choices:shuffle(["Ports and transport infrastructure","Only castles","Only temples","Only farms"])},
        {q:"How did Americans change local government?", a:"Introduced municipal and provincial government structures", choices:shuffle(["Introduced municipal and provincial government structures","No local officials","Only tribal leaders","Only national governors"])},
        {q:"What was one legacy of the American period?", a:"Use of English in government and education", choices:shuffle(["Use of English in government and education","Spanish only","Japanese only","No language change"])},
        {q:"What happened to Filipino soldiers during American period?", a:"Some served with U.S. forces and later with Commonwealth army", choices:shuffle(["Some served with U.S. forces and later with Commonwealth army","No soldiers","Only pirates","Only knights"])},
        {q:"What was a major public health action under Americans?", a:"Campaigns vs. smallpox and cholera", choices:shuffle(["Campaigns vs. smallpox and cholera","No health actions","Only magic cures","Only traditional healing"])},
        {q:"Why did Filipino leaders negotiate with the U.S.?", a:"To gain eventual independence and self-government", choices:shuffle(["To gain eventual independence and self-government","To be colonized by another country","To ban education","To remain isolated"])},
        {q:"What was the economic relationship with the U.S. like?", a:"Closer trade and investment ties", choices:shuffle(["Closer trade and investment ties","Complete isolation","Only barter","Only local trade"])},
        {q:"What did the Philippine Scouts refer to?", a:"Filipino soldiers serving under U.S. Army", choices:shuffle(["Filipino soldiers serving under U.S. Army","A group of farmers","A folklore group","A shipping fleet"])},
        {q:"Which act created the Commonwealth government?", a:"Tydings–McDuffie Act and subsequent acts leading to the 1935 Constitution", choices:shuffle(["Tydings–McDuffie Act and 1935 Constitution","Jones Act only","Treaty of Paris only","No act"])},
        {q:"What was a major challenge during American rule?", a:"Local resistance from the Philippine-American War and adjustment to new rule", choices:shuffle(["Local resistance from the Philippine-American War and adjustment to new rule","No challenges","Only prosperity","Only sports development"])},
        {q:"Which year did full independence from U.S. occur (after WWII)?", a:"1946", choices:shuffle(["1946","1935","1898","1941"])}
      );
    }
    else if(lesson === "Japanese Occupation"){
      questions.push(
        {q:"When did the Japanese occupy the Philippines during WWII?", a:"1941–1945", choices:shuffle(["1941–1945","1898","1901","1935"])},
        {q:"What major event began Japanese occupation?", a:"Attack on Pearl Harbor and invasion of the Philippines (1941)", choices:shuffle(["Attack on Pearl Harbor and invasion (1941)","Spanish arrival (1521)","American landing (1898)","Korean War"])},
        {q:"What did the Japanese occupation cause?", a:"Hardship, shortages, and violence", choices:shuffle(["Hardship, shortages, and violence","Abundant food","Immediate prosperity","No change"])},
        {q:"Who led guerilla resistance against the Japanese?", a:"Filipino guerillas and Allied soldiers", choices:shuffle(["Filipino guerillas and Allied soldiers","Only Japanese forces","Only Americans","Only Spanish colonists"])},
        {q:"What was the Bataan Death March?", a:"Forced march of Filipino and American POWs with many deaths", choices:shuffle(["Forced march of Filipino and American POWs with many deaths","A festival","A trade route","A parade"])},
        {q:"What happened to many towns during the war?", a:"Destruction and battles in towns and countryside", choices:shuffle(["Destruction and battles in towns and countryside","No change","Only growth","Only peace"])},
        {q:"Who helped liberate the Philippines from Japan?", a:"Allied forces led by the U.S.", choices:shuffle(["Allied forces led by the U.S.","Spain","Only local police","Only civilians"])},
        {q:"Which general led the liberation of the Philippines?", a:"General Douglas MacArthur (returned to the Philippines)", choices:shuffle(["Douglas MacArthur","Ferdinand Marcos","Jose Rizal","Andres Bonifacio"])},
        {q:"What year did MacArthur return to the Philippines?", a:"1944", choices:shuffle(["1944","1898","1901","1941"])},
        {q:"What happened to the Jewish and other minorities during WWII globally?", a:"Persecution in many areas (context of WWII)", choices:shuffle(["Persecution in many areas (context of WWII)","No persecution","Only prosperity","No change"])},
        {q:"What was one aftermath of Japanese occupation?", a:"Widespread destruction and need for rebuilding", choices:shuffle(["Widespread destruction and need for rebuilding","Immediate wealth","No damage","Only cultural change"])},
        {q:"What resistance organization worked in the Philippines?", a:"Multiple guerrilla groups across the islands", choices:shuffle(["Multiple guerrilla groups across the islands","One single group only","No groups","Only foreign groups"])},
        {q:"Which city saw heavy fighting and later liberation (1945)?", a:"Manila", choices:shuffle(["Manila","Cebu only","Davao only","Baguio only"])},
        {q:"What happened to many civilians during the occupation?", a:"Suffered food shortages and violence", choices:shuffle(["Suffered food shortages and violence","Lived normally","Became wealthy","Travelled abroad easily"])},
        {q:"What is a remembrance about the war today?", a:"Memorials and stories honoring those who suffered", choices:shuffle(["Memorials and stories honoring those who suffered","No remembrance","Only parties","Only celebrations"])},
        {q:"Which year marks the end of WWII in the Philippines?", a:"1945", choices:shuffle(["1945","1941","1901","1898"])},
        {q:"What was a wartime experience Filipino families faced?", a:"Evacuation, hiding, and shortages", choices:shuffle(["Evacuation, hiding, and shortages","Luxury travel","Higher wages","No changes"])},
        {q:"What was done after liberation to help the country?", a:"Reconstruction and return to civilian rule", choices:shuffle(["Reconstruction and return to civilian rule","Immediate independence without damage","No reconstruction","Only economic collapse"])},
        {q:"What was the role of Filipino guerrillas?", a:"Support liberation and resist occupation", choices:shuffle(["Support liberation and resist occupation","Collaborate only","No role","Only farming"])},
        {q:"What atrocity during the occupation is widely remembered?", a:"Bataan Death March and civilian massacres like Manila 1945", choices:shuffle(["Bataan Death March and Manila massacres","Only sports events","Only trade fairs","No atrocities"])},
        {q:"How did WWII affect cities in the Philippines?", a:"Many cities were heavily damaged and needed rebuilding", choices:shuffle(["Many cities were heavily damaged and needed rebuilding","Cities thrived","No damage","Better infrastructure only"])},
        {q:"What was one challenge after WWII?", a:"Homelessness, destroyed infrastructure, and economic recovery", choices:shuffle(["Homelessness, destroyed infrastructure, and economic recovery","No challenges","Only foreign aid","Immediate industrialization"])},
        {q:"What else influenced post-war Philippines from WWII?", a:"Stronger ties with the U.S. and move toward independence", choices:shuffle(["Stronger ties with the U.S. and move toward independence","Closer ties with Spain","Isolation","Only local politics"])},
        {q:"What is one way we remember WWII in the Philippines?", a:"Museums, memorials, and education", choices:shuffle(["Museums, memorials, and education","No remembering","Annual trade fair only","TV shows only"])},
        {q:"Who suffered many losses during the occupation?", a:"Filipino civilians and soldiers", choices:shuffle(["Filipino civilians and soldiers","Only visitors","Only animals","No one"])},
        {q:"What international event ended WWII and affected the Philippines?", a:"Allied victory in 1945", choices:shuffle(["Allied victory in 1945","Spanish victory","American Civil War","Cold War only"])},
        {q:"What did the Philippines regain after WWII?", a:"Path to full independence (1946)", choices:shuffle(["Path to full independence (1946)","Return to Spain","Remain Japanese colony","No change"])}
      );
    }
    else if(lesson === "Post-War"){
      questions.push(
        {q:"When did the Philippines gain full independence after WWII?", a:"July 4, 1946", choices:shuffle(["July 4, 1946","June 12, 1898","December 30, 1935","May 1, 1950"])},
        {q:"What was a major task after the war?", a:"Reconstruction and rebuilding cities and economy", choices:shuffle(["Reconstruction and rebuilding cities and economy","Starting space program","No tasks","Only celebrations"])},
        {q:"What government system was restored after WWII?", a:"Republic with elected leaders", choices:shuffle(["Republic with elected leaders","Monarchy","Japanese rule","Spanish rule"])},
        {q:"Which international ally helped in rebuilding?", a:"United States provided aid and assistance", choices:shuffle(["United States provided aid and assistance","Spain","Japan only","No allies"])},
        {q:"What social issue was important post-war?", a:"Resettlement of refugees and rebuilding families", choices:shuffle(["Resettlement of refugees and rebuilding families","Only industrialization","Only education","No social issues"])},
        {q:"What became important for development post-war?", a:"Infrastructure, schools, and health services", choices:shuffle(["Infrastructure, schools, and health services","Only banks","Only sports","No services"])},
        {q:"Which constitution guided post-war Philippines?", a:"The 1935 Constitution (amended) and later the 1943/1946 arrangements", choices:shuffle(["The 1935 Constitution (amended) and later 1946 arrangements","No constitution","Only foreign laws","Only local customs"])},
        {q:"Who was a major post-war president (early period)?", a:"Manuel Roxas (first president of independent Third Republic)", choices:shuffle(["Manuel Roxas","Jose Rizal","Andres Bonifacio","Emilio Aguinaldo"])},
        {q:"What economic activity was prioritized post-war?", a:"Agriculture recovery and trade", choices:shuffle(["Agriculture recovery and trade","Only industry","Only services","Space exploration"])},
        {q:"What was an important step towards stability after war?", a:"Rebuilding government institutions and economy", choices:shuffle(["Rebuilding government institutions and economy","No steps","Only festivals","Only sports teams"])},
        {q:"What international organization did the Philippines join after WWII?", a:"United Nations (founding member in 1945)", choices:shuffle(["United Nations (1945)","NATO","Warsaw Pact","ASEAN only later"])},
        {q:"What challenge did veterans face post-war?", a:"Reintegration, wounds, and need for benefits", choices:shuffle(["Reintegration, wounds, and need for benefits","No challenges","Immediate riches","Only jobs"])},
        {q:"What changed in city planning post-war?", a:"Reconstruction with improved roads and services", choices:shuffle(["Reconstruction with improved roads and services","No change","Only more markets","Only parks"])},
        {q:"What cultural change followed the war?", a:"Blending of local, American, and other influences", choices:shuffle(["Blending of local, American, and other influences","Only Spanish culture","Only Japanese culture","No blend"])},
        {q:"What was a major foreign policy after independence?", a:"Diplomacy with allies and rebuilding ties", choices:shuffle(["Diplomacy with allies and rebuilding ties","Isolation","Only local trade","No policy"])},
        {q:"What social program helped many families after war?", a:"Land reform and housing projects (attempts)", choices:shuffle(["Land reform and housing projects (attempts)","Only entertainment","Only sports","No programs"])},
        {q:"Which year did Philippine independence day later change to June 12?","a":"1962 (officially moved later)","choices":shuffle(["1962","1946","1898","1950"])},
        {q:"What was a continuing issue after independence?", a:"Economic recovery and political stability", choices:shuffle(["Economic recovery and political stability","No issues","Only tourism","Only technology"])},
        {q:"What infrastructure improved in the post-war era?", a:"Roads, ports, and public buildings", choices:shuffle(["Roads, ports, and public buildings","Only palaces","Only forts","No improvements"])},
        {q:"How did education change in post-war period?", a:"Expansion of public education and universities", choices:shuffle(["Expansion of public education and universities","No schools","Only private tutors","Only trade schools"])},
        {q:"What regional body did the Philippines later help form (1967)?", a:"ASEAN (1967) later — the Philippines was a founding member", choices:shuffle(["ASEAN (1967) later — founding member","EU","AU","UN only"])},
        {q:"What remained a major post-war economic sector?", a:"Agriculture and growing manufacturing", choices:shuffle(["Agriculture and growing manufacturing","Only IT","Only mining","No sector"])},
        {q:"Which problem required land and social policies post-war?", a:"Land ownership and redistribution", choices:shuffle(["Land ownership and redistribution","Only taxes","Only education","No problem"])},
        {q:"What role did women play post-war?", a:"Participated in rebuilding, education and workforce", choices:shuffle(["Participated in rebuilding, education and workforce","No role","Only domestic role","Only political role"])},
        {q:"What international relationship remained important after independence?", a:"Strong ties with the United States", choices:shuffle(["Strong ties with the United States","Only Spain","Only Japan","No ties"])},
        {q:"What did cultural life in the Philippines include post-war?", a:"Music, film, and literature revival", choices:shuffle(["Music, film, and literature revival","Only ancient arts","Only imported culture","No culture"])},
        {q:"What long-term task started in post-war years?", a:"Continued nation-building and economic development", choices:shuffle(["Continued nation-building and economic development","Immediate utopia","No tasks","Only festivals"])}
      );
    }
    // Ensure we return at least an array; caller will shuffle & slice 5-10
  }
  return questions;
}

// --- Science questions (same as before) ---
function generateScienceQuestions(topic,count){
  const qs=[];
  for(let i=0;i<count;i++){
    let q,a;
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
        qs.push({q:"What is an 'octopus'?", a:"A sea animal with eight arms", choices:shuffle(["A sea animal with eight arms","A fish","A bird","A reptile"])});
    }
    // Additional vocabulary branches (Colors, Numbers, Fruits, and Filipino ones)...
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
    }
    if(lesson==="Numbers"){
      qs.push({q:"How many fingers do we have?", a:"10", choices:shuffle(["10","5","20","15"])});
      qs.push({q:"What comes after 2?", a:"3", choices:shuffle(["3","4","1","5"])});
      qs.push({q:"How many days are in a week?", a:"7", choices:shuffle(["7","5","10","6"])});
      qs.push({q:"What number comes before 5?", a:"4", choices:shuffle(["4","3","5","6"])});
      qs.push({q:"How many months are in a year?", a:"12", choices:shuffle(["12","10","11","6"])});
    }
    if(lesson==="Fruits"){
      qs.push({q:"Which is a fruit?", a:"Apple", choices:shuffle(["Apple","Carrot","Potato","Lettuce"])});
      qs.push({q:"Which is yellow and sour?", a:"Lemon", choices:shuffle(["Lemon","Banana","Apple","Mango"])});
      qs.push({q:"Which fruit is tropical and orange inside?", a:"Mango", choices:shuffle(["Mango","Apple","Strawberry","Grapes"])});
      qs.push({q:"Which fruit is small and red?", a:"Strawberry", choices:shuffle(["Strawberry","Apple","Banana","Orange"])});
      qs.push({q:"Which fruit is purple and grows in bunches?", a:"Grapes", choices:shuffle(["Grapes","Plum","Blueberry","Mango"])});
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

// Download certificate (render to canvas & download)
function downloadCertificate(){
  const name = document.getElementById("certName").innerText || "Student";
  const lesson = document.getElementById("certLesson").innerText || "Lesson";
  const badge = document.getElementById("certBadge").innerText || "";
  const canvas = document.getElementById("certCanvas");
  const ctx = canvas.getContext("2d");

  // clear
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // background
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // border & dots
  ctx.strokeStyle = "#e6eefb";
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
