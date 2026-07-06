// Preloader
window.addEventListener('load',()=>{const e=document.getElementById('preloader');if(e)setTimeout(()=>e.classList.add('is-hidden'),350);});
// Hamburger menu
const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav-links');const actions=document.querySelector('.nav-actions');if(toggle&&nav&&actions){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));nav.classList.toggle('is-open');actions.classList.toggle('is-open');});}