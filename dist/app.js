const courses=JSON.parse(document.getElementById('course-data').textContent);
document.documentElement.classList.add('js');
const form=document.querySelector('.filters');
function filter(){const f=new FormData(form);let n=0;courses.forEach(c=>{const show=(!f.get('region')||c.region===f.get('region'))&&(!f.get('season')||(c.season.includes(f.get('season'))||c.season.includes('사계절')))&&(!f.get('theme')||c.themes.includes(f.get('theme')));document.querySelector(`[data-course="${c.id}"]`).hidden=!show;if(show)n++});document.getElementById('count').textContent=n;document.getElementById('empty').hidden=n!==0;}
form.addEventListener('change',filter);form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('reset',()=>setTimeout(filter));document.getElementById('reset-empty').addEventListener('click',()=>form.reset());
function route(){const hash=location.hash.slice(1);const course=courses.find(c=>hash===c.id||hash.startsWith(c.id+'-day'));document.getElementById('courses').hidden=!!course;document.querySelectorAll('.course-detail').forEach(x=>x.classList.toggle('active',x.id===course?.id));document.title=course?`${course.title} — 먹고 걷고`:'먹고 걷고 — 우리 둘의 여행';if(course&&hash!==course.id){requestAnimationFrame(()=>document.getElementById(hash)?.scrollIntoView());}else window.scrollTo(0,0);}
window.addEventListener('hashchange',route);route();
const viewer=document.getElementById('photo-viewer');
let photoTrigger=null;
document.querySelectorAll('.photo-open').forEach(a=>a.addEventListener('click',event=>{if(typeof viewer.showModal!=='function')return;event.preventDefault();photoTrigger=a;document.getElementById('photo-full').src=a.getAttribute('href');document.getElementById('photo-full').alt=a.dataset.photoCaption;document.getElementById('photo-title').textContent=a.dataset.photoCaption;viewer.showModal();}));
viewer.querySelector('.photo-close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',event=>{if(event.target===viewer){const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close();}});
viewer.addEventListener('close',()=>photoTrigger?.focus());
