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
var alphabet = ["a","b","c","ç","d","e","f","g","ğ","h","I","İ","j","k","l","m","n","o","ö","p","r","s","ş","t","u","ü","v","y","z"];
var joker = "?";
var b = [
  "B",
  "C",
  "Ç",
  "D",
  "F",
  "G",
  "Ğ",
  "H",
  "J",
  "K",
  "L",
  "M",
  "N",
  "P",
  "R",
  "S",
  "Ş",
  "T",
  "V",
  "Y",
  "Z",
];
var a = ["A", "E", "I", "İ", "O", "Ö", "U", "Ü"];
const soru = document.getElementById("soru");
const surem = document.getElementById("sure");
const devm = document.getElementById("devam");
const sozluk = document.getElementById("sozluk");
const tdk = "https://sozluk.gov.tr/gts?ara=";
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
  document.getElementById("tema").innerHTML = `<img src="tema${temam}.svg"/> Temayı Değiştir`;
}
else{
  document.getElementById("tema").innerHTML = `<img src="tema${temam}.svg"/> Temayı Değiştir`;
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
    fetch(tdk + aranan.toLocaleLowerCase("tr-TR"))
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
  if (gelen.error == "Sonuç bulunamadı") {
    document.getElementById("sonucBaslik").innerHTML = "";
    document.getElementById("sonucAnlam").innerHTML =
      "Maalesef sözlükte böyle bir kelime bulunmamakta.";
    dogru = false;
  } else {
    anlam = "";
    anlamsayisi = 1;
    let baslik = gelen[0].madde;
    let bilgi = gelen[0].lisan;
    console.log(gelen)
    gelen.map((item) => {
      if(item.lisan !== ""){ anlam += `<div class='sonucbilgi'>${item.lisan}</div>`};
      item.anlamlarListe.map((item) => {
        anlam += `<div><span style="color:hsl(${Math.floor(Math.random() * 360)},${40 + Math.floor(Math.random() * 60)}%,${!Number(temam) ? (5 + Math.floor(Math.random() * 70)) : (35 + Math.floor(Math.random() * 65))}%)">${anlamsayisi}.</span> ${item.anlam.substr(0,3) == "343" ? `bkz. ${item.anlam.substr(3)}` : item.anlam } </div>`;
        anlamsayisi++;
      })
      anlam += "<div class='cizgi'></div>"
    })
    document.getElementById("sonucBaslik").innerHTML = baslik;
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
    cevapla.innerHTML = "CEVAP";
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
    ).innerHTML = `Tebrikler, ${puan} puan kazandınız. <br/>Toplam Puanınız: ${puanim} <br/> <button onclick='gecis()' class='devam'>Devam Et</button>`;
  } else {
    console.log("yanlış cevap");
    document.getElementById(
      "puan"
    ).innerHTML = `Puan alamadınız :( <br/>Toplam Puanınız: ${puanim} <br/> <button onclick='gecis()' class='devam'>Devam Et</button>`;
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
    butonum.innerHTML = item.toLocaleUpperCase();
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
	if(!localStorage.getItem("rekor")){
    uyari.className = "rekor";
    uyari.style.display = "block";
    uyari.innerHTML = "Tebrikler, yeni rekor!";
		localStorage.setItem("rekor",puanim)
	}
	else if(localStorage.getItem("rekor") < puanim){
    uyari.className = "rekor";
    uyari.style.display = "block";
    uyari.innerHTML = "Tebrikler, yeni rekor!";
    localStorage.setItem("rekor",puanim);
  }
	document.getElementById("rekor").innerHTML = localStorage.getItem("rekor");
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
  document.getElementById("tema").innerHTML = `<img src="tema${temam}.svg"/> Temayı Değiştir`;
}

function uyar(){
  console.log("uyar");
  uyari.style.display = "block";
  while (uyari.classList.length > 0) {
    uyari.classList.remove(uyari.classList.item(0));
  }
  uyari.classList.add("hata");
  uyari.innerHTML = "Cevabınız gönderilemedi. İnternet problemi veya anlık kesinti yaşıyor olabilirsiniz. Anasayfaya yönlendirileceksiniz.";
  setTimeout(()=>{uyari.style.display = "none"},3000)
}

function menuac(){
  document.getElementById("menu").classList.add("active");
}

function menukapa(){
  document.getElementById("menu").classList.remove("active");
}