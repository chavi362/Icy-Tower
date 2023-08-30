
let hero1 = document.getElementById('hero1');
let hero2 = document.getElementById('hero2');
let hero3 = document.getElementById('hero3');
let hero;
hero2Click = function () {
    hero = "../image/hero2_2.png";
    sessionStorage.setItem('hero', hero);
    window.location.replace("../html/difficulty-levels.html");
}
hero3Click = function () {
    hero = "../image/hero3_2.png";
    sessionStorage.setItem('hero', hero);
    window.location.replace("../html/difficulty-levels.html");

}
hero1Click = function () {
    hero = "../image/hero1_2.png";
    sessionStorage.setItem('hero', hero);
    window.location.replace("../html/difficulty-levels.html");
}
hero1.addEventListener('click', hero1Click);
hero2.addEventListener('click', hero2Click);
hero3.addEventListener('click', hero3Click);
