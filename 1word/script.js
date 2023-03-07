const loader = document.getElementById("loader");
var tip0 = [
  "b",
  "a",
  "b",
  "a",
  "b",
  "a",
  "b",
  "b",
  "joker",
];
var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
var joker = "?";
var b = [
  "B",
  "C",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "M",
  "N",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "V",
  "X",
  "Y",
  "Z",
];
var a = ["A", "E", "I", "O", "U"];
const soru = document.getElementById("soru");
const surem = document.getElementById("sure");
const devm = document.getElementById("devam");
const sozluk = document.getElementById("sozluk");
const tdk = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const cevapla = document.getElementById("cevapla");
const sifirsure = 40;
const uyari = document.getElementById("uyari");

var baslangic = true;
var k = 1;
var t = sifirsure;
var cevabim = "";
var puancarpani = 0;
var dogru = false;
var ilk = true;
var cevapveriyor = false;
var puanim = 0;
var oyun = 0;
var jokerli = 1;
var temam = 0;
var anlam,anlamsayisi;

if(localStorage.getItem("theme")){
  document.body.classList.add(`theme${localStorage.theme}`);
  temam = localStorage.theme;
  document.getElementById("tema").innerHTML = `<img src="tema${temam}.svg"/> <span>Change the theme</span>`;
}
else{
  document.getElementById("tema").innerHTML = `<img src="tema${temam}.svg"/> <span>Change the theme</span>`;
}

function bak() {
  setTimeout(basla, 3000);
  devm.style.bottom = "-10%";
  devm.style.transform = "translate(-50%,100%)";
}

function basla() {
  loader.style.top = "-100%";
  soruyap();
  baslangic = false;
}

function sure() {
  if (t == 0) {
    t = sifirsure;
    k++;
    if(!cevapveriyor){dogru = false;
    puanla();}
    document.getElementById("joker").style.top = "100%";
  } else {
    t--;
    surem.innerHTML = t;
    setTimeout(sure, 1000);
  }
  console.log(t)
}

function gecis() {
  loader.style.top = "0";
  baslangic = true;
  setTimeout(basla, 2500);
  sozlukac();
}

function ara() {
  console.log("aramada")
  if (cevapveriyor) {
    var aranan = document.getElementById("cevapla").innerHTML;
    fetch(tdk + aranan.toLocaleLowerCase("en-US"))
      .then((response) => response.json())
      .catch((e) => {
        uyar();
        setTimeout(() => {document.location = "";},3100);
      })
      .then(aramayap);
      cevapladisable(1);
  }
}

const aramayap = (gelen) => {
  console.log("Geldi");
  if (gelen.title == "No Definitions Found") {
    document.getElementById("sonucBaslik").innerHTML = "";
    document.getElementById("sonucBilgi").innerHTML = "";
    document.getElementById("sonucAnlam").innerHTML =
      "Sorry, but there is not a word like that in our dictionary.";
    dogru = false;
  } else {
    anlam = "";
    anlamsayisi = 1;
    console.log(gelen)
    let baslik = gelen[0].word;
    let bilgi = gelen[0].phonetic !== undefined ? gelen[0].phonetic : "";
    gelen[0].meanings.map((item) => {
      anlam += `<div class='sonucbilgi'>${item.partOfSpeech}</div>`;
      item.definitions.map((item) => {
        anlam += `<div><span style="color:rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})">${anlamsayisi}.</span> ${item.definition } </div>`;
        anlamsayisi++;
      })
      anlam += "<div class='cizgi'></div>"
    })
    document.getElementById("sonucBaslik").innerHTML = baslik;
    document.getElementById("sonucBilgi").innerHTML = bilgi;
    document.getElementById("sonucAnlam").innerHTML = anlam;
    dogru = true;
  }
  puanla();
};

function soruyap() {
  jokerli = 1;
  cevapladisable(0);
  if (oyun == 10) bitti();
  else {
    cevapla.innerHTML = "ANSWER";
    if (document.getElementById("puan").classList.contains("verildi"))
      document.getElementById("puan").classList.remove("verildi");
    ilk = true;
    cevapveriyor = false;
    soru.innerHTML = "";
    cevabim = "";
    tip0.forEach((item) => {
      let butonum = butonyap();
      let kactane = window[item].length;
      let icerik = Math.floor(Math.random() * kactane);
      butonum.innerHTML = window[item][icerik];
      butonum.addEventListener("click", (e) => {
        if (e.target.innerHTML != "?") {
          if (ilk) {
            ilk = false;
            cevapveriyor = true;
          }
          console.log(e.target.innerHTML);
          cevabim += e.target.innerHTML;
          e.target.classList.add("disabled");
          cevapla.innerHTML = cevabim;
        } 
        else {
          if(ilk) {
            ilk = false;
            cevapveriyor = true;
           }
           e.target.classList.add("disabled");
          jokerkullan();
        }
      });
      soru.appendChild(butonum);
    });
    surem.innerHTML = sifirsure;
    t = sifirsure;
	oyun++;
    setTimeout(sure, 1000);
  }
}

function puanla() {
  puancarpani = t;
  console.log(puancarpani);
  console.log("puanlamada");
  console.log("soru tipi kelime");
  t = 0;
  if (dogru) {
    console.log("doğru cevap");
    console.log(jokerli)
    let puan = Math.round(((puancarpani*2) + (cevapla.innerHTML.length * 20)) * jokerli);
    console.log(puan);
    console.log(puancarpani);
    puanim += puan;
    document.getElementById(
      "puan"
    ).innerHTML = `Congrats, you scored ${puan} points. <br/>Your Total Score is: ${puanim} <br/> <button onclick='gecis()' class='devam'>Continue</button>`;
  } else {
    console.log("yanlış cevap");
    document.getElementById(
      "puan"
    ).innerHTML = `Sorry, you couldn't score :( <br/>Your Total Score is: ${puanim} <br/> <button onclick='gecis()' class='devam'>Continue</button>`;
  }
  document.getElementById("puan").classList.add("verildi");
  document.querySelectorAll("#soru button").forEach((item) => {
    item.style.pointerEvents = "none";
  });
  sozlukac();
}

function sozlukac() {
  sozluk.classList.toggle("inactive");
  console.log("Sozluk");
}

function butonyap() {
  let btn = document.createElement("button");
  btn.classList.add("buton");
  return btn;
}

function jokerkullan() {
  document.getElementById("jokeric").innerHTML = "";
  document.getElementById("joker").style.top = "0";
  jokerli = 9/10;
  alphabet.forEach((item) => {
    let butonum = butonyap();
    butonum.innerHTML = item.toLocaleUpperCase("en-US");
    document.getElementById("jokeric").appendChild(butonum);
    butonum.addEventListener("click", (e) => {
      cevabim += e.target.innerHTML;
      e.target.classList.add("disabled");
      cevapla.innerHTML = cevabim;
      document.getElementById("joker").style.top = "100%";
    })
  });
}

function bitti(){
	document.getElementById("bitim").innerHTML = puanim;
	if(!localStorage.getItem("record")){
    uyari.className = "rekor";
    uyari.style.display = "block";
    uyari.innerHTML = "Congrats! New Record!";
		localStorage.setItem("record",puanim)
	}
	else if(localStorage.getItem("record") < puanim){
    uyari.className = "rekor";
    uyari.style.display = "block";
    uyari.innerHTML = "Congrats! New Record!";
    localStorage.setItem("record",puanim);
  }
	document.getElementById("rekor").innerHTML = localStorage.getItem("record");
	document.getElementById("bitti").style.top = "0";
}

function anasayfa(){
	document.location = "";
}

function cevapladisable(o){
  if(o)cevapla.style.pointerEvents = "none";
  else{cevapla.style.pointerEvents = "auto"}
}

function tema(){
  console.log(temam);
  temam++;
  console.log(temam);
  temam = temam %2;
  console.log(temam);
  while (document.body.classList.length > 0) {
    document.body.classList.remove(document.body.classList.item(0));
  }
  document.body.classList.add(`theme${temam}`);
  localStorage.setItem("theme",temam);
  document.getElementById("tema").innerHTML = `<img src="tema${temam}.svg"/> <span>Change the theme</span>`;
}

function uyar(){
  console.log("uyar");
  uyari.style.display = "block";
  while (uyari.classList.length > 0) {
    uyari.classList.remove(uyari.classList.item(0));
  }
  uyari.classList.add("hata");
  uyari.innerHTML = "We couldn't send your answer. It may be a connection problem. You are now being directed to the mainpage.";
  setTimeout(()=>{uyari.style.display = "none"},3000)
}

function menuac(){
  document.getElementById("menu").classList.add("active");
}

function menukapa(){
  document.getElementById("menu").classList.remove("active");
}