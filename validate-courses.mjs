import fs from 'node:fs';
import assert from 'node:assert/strict';
const courses=fs.readdirSync('data').filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync('data/'+f))).sort((a,b)=>a.order-b.order);
assert.equal(courses.length,40);assert.equal(new Set(courses.map(c=>c.id)).size,40);
const cities=['수원','용인','오산','평택','안성','광주','하남','남양주','파주','가평'];
const newPhotos=new Set(),sigs=new Set();
function days(s){if(s.includes('매일'))return '월화수목금토일';return s.split(/\d/)[0].replace(/([월화수목금토일])-([월화수목금토일])/g,(_,a,b)=>'월화수목금토일'.slice('월화수목금토일'.indexOf(a),'월화수목금토일'.indexOf(b)+1));}
const mins=s=>s.split(':').reduce((a,b)=>a*60+Number(b),0);
for(const [i,c]of courses.entries()){
 assert.equal(c.order,i);assert.equal(c.days.length,3);
 for(const p of [c.hero_photo,...c.days.flatMap(d=>d.steps.map(s=>s.photo))]){assert.ok(p?.url,'Missing photo '+c.id);assert.ok(fs.existsSync('dist/'+p.url),'Missing image '+p.url);if(i>=30)assert.ok(p.source,'Missing photo source '+c.id);}
 if(i<30)continue;
 assert.equal(c.region,'수도권');const stayAreas=[/행궁동|인계동/,/신갈|기흥/,/오산|운암/,/평택/,/안성|아양/,/곤지암/,/미사/,/팔당|조안/,/헤이리|탄현/,/청평/];assert.match(c.stay.area,stayAreas[i-30]);
 assert.ok(!/아산|온양|외암|현충사|Oeam/.test(JSON.stringify(c)),'Copied Asan content '+c.id);
 const names=c.days.flatMap(d=>d.steps.map(s=>s.name));const sig=names.join('|');assert.ok(!sigs.has(sig),'Duplicate course');sigs.add(sig);
 for(const d of c.days){let prev=-1;for(const s of d.steps){assert.ok(mins(s.time)>prev,'Unsorted time '+c.id);prev=mins(s.time);newPhotos.add(s.photo.url);if(!s.business)continue;const b=s.business;assert.ok(b.address.includes(cities[i-30]),'Wrong city '+s.name+' '+b.address);assert.ok(b.address.startsWith('경기'),'Wrong province '+s.name);assert.ok(b.hours&&b.closed_days&&b.checked_at,'Missing business info');const weekday=['금','토','일'][d.day-1];assert.ok(!b.closed_weekdays.includes(weekday),'Closed weekday '+s.name);const spans=b.hours.split(' / ').filter(x=>days(x).includes(weekday));assert.ok(spans.some(x=>{const m=x.match(/(\d\d:\d\d)-(\d\d:\d\d)/);if(!m)return false;let a=mins(m[1]),z=mins(m[2]);if(z<=a)z+=1440;return prev>=a&&prev+40<=z}),'Outside hours '+c.id+' '+s.name+' '+s.time);const week=b.weekly.find(x=>x.date.includes('('+weekday+')')&&!x.hours.includes('휴무'));const bt=week?.hours.match(/브레이크타임:\s*(\d\d:\d\d)\s*-\s*(\d\d:\d\d)/);assert.ok(!bt||prev+40<=mins(bt[1])||prev>=mins(bt[2]),'Break conflict '+s.name);}}
 const food=c.days.flatMap(d=>d.steps).filter(s=>['아침','점심','저녁'].includes(s.type));assert.equal(food.length,7,'Meals '+c.id);assert.ok(c.days.flatMap(d=>d.steps).some(s=>s.type==='카페'));
}
console.log(`Validated ${courses.length} courses: unique IDs/order, image paths, 10 distinct local itineraries, 70 meals, regional addresses and Fri–Sun opening windows. New images: ${newPhotos.size}.`);
