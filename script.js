const STORAGE_KEY = 'lecturerCompanionDataV2';
let state = {
  activeNoteId: 1,
  notes: [
    {id:1, course:'Akuntansi Keuangan', title:'Pertemuan 3 - Persamaan Dasar Akuntansi', content:'Persamaan Dasar Akuntansi\n\nAset = Liabilitas + Ekuitas\n\nContoh:\nKas bertambah Rp10.000 maka aset naik.\nUtang bertambah Rp10.000 maka liabilitas naik.\n\nPertanyaan:\nBedanya aset lancar dan tidak lancar.', favorite:true, updated:'2026-06-11'},
    {id:2, course:'Perpajakan', title:'PPh Pasal 23', content:'PPh Pasal 23 terutang pada akhir bulan pembayaran, disediakan untuk dibayar, atau jatuh tempo pembayaran. Penyetoran paling lambat tanggal 10 bulan berikutnya dan SPT Masa dilaporkan paling lambat tanggal 20 setelah masa pajak berakhir.', favorite:false, updated:'2026-06-10'},
    {id:3, course:'Akuntansi Keuangan', title:'Siklus Akuntansi', content:'Siklus akuntansi terdiri dari transaksi, jurnal, buku besar, neraca saldo, jurnal penyesuaian, laporan keuangan, jurnal penutup, dan neraca saldo setelah penutupan.', favorite:false, updated:'2026-06-09'}
  ],
  schedules: [
    {date:'2026-06-12', time:'08:00', title:'Review Akuntansi Keuangan'},
    {date:'2026-06-14', time:'10:00', title:'Latihan Perpajakan'}
  ],
  lastRekap: ''
};

function loadData(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved){
    try{ state = JSON.parse(saved); }catch(e){}
  }
}
function persist(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function courses(){ return [...new Set(state.notes.map(n => n.course).filter(Boolean))]; }
function activeNote(){ return state.notes.find(n => n.id == state.activeNoteId) || state.notes[0]; }

function showApp(){
  document.getElementById('loginPage').style.display='none';
  document.getElementById('appShell').style.display='block';
  renderAll();
  window.scrollTo(0,0);
}
function loginFromPage(){
  const u=document.getElementById('loginUsername').value.trim();
  const p=document.getElementById('loginPassword').value.trim();
  const info=document.getElementById('pageLoginInfo');
  if(u==='mahasiswa'&&p==='123456'){
    info.className='demo-info login-success';
    info.textContent='Login berhasil. Mengalihkan ke dashboard...';
    setTimeout(showApp,400);
  }else{
    info.className='demo-info login-error';
    info.textContent='Username atau password salah. Gunakan mahasiswa / 123456';
  }
}
function logout(){
  document.getElementById('appShell').style.display='none';
  document.getElementById('loginPage').style.display='flex';
  document.getElementById('loginPassword').value='';
  document.getElementById('pageLoginInfo').className='demo-info';
  document.getElementById('pageLoginInfo').innerHTML='Akun demo: <b>mahasiswa</b> | Password: <b>123456</b>';
}

function renderAll(){ renderNotes(); renderCourses(); renderRekapOptions(); renderSchedules(); renderProgress(); }
function renderNotes(){
  const q = (document.getElementById('noteSearchTop')?.value || '').toLowerCase();
  const picker = document.getElementById('notePicker');
  if(!picker) return;
  const filtered = state.notes.filter(n => (n.title+n.course+n.content).toLowerCase().includes(q));
  picker.innerHTML = filtered.map(n => `<option value="${n.id}">${n.favorite?'★ ':''}${n.course} - ${n.title}</option>`).join('');
  if(filtered.length && !filtered.some(n => n.id == state.activeNoteId)) state.activeNoteId = filtered[0].id;
  const n = activeNote();
  if(n){
    picker.value = n.id;
    document.getElementById('noteCourse').value = n.course;
    document.getElementById('noteTitle').value = n.title;
    document.getElementById('noteBox').value = n.content;
  }
  document.getElementById('noteCount').textContent = state.notes.length;
  document.getElementById('favCount').textContent = state.notes.filter(n=>n.favorite).length;
}
function renderCourses(){
  const ul = document.getElementById('courseList');
  ul.innerHTML = courses().map(c => `<li>${c} <b>${state.notes.filter(n=>n.course===c).length}</b></li>`).join('');
}
function renderRekapOptions(){
  const select = document.getElementById('rekapCourse');
  select.innerHTML = courses().map(c => `<option>${c}</option>`).join('');
  renderMeetings();
}
function renderMeetings(){
  const course = document.getElementById('rekapCourse')?.value || courses()[0];
  const list = document.getElementById('meetingList');
  const notes = state.notes.filter(n=>n.course===course);
  list.innerHTML = notes.map((n,i)=>`<p class="${n.id==state.activeNoteId?'active':''}">Pertemuan ${i+1}<br><span>${n.title}</span></p>`).join('') || '<p>Belum ada catatan.</p>';
}
function renderSchedules(){
  const box = document.getElementById('scheduleList');
  const sorted = [...state.schedules].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  box.innerHTML = sorted.map((s,i)=>`<div class="schedule-item"><b>${s.date} ${s.time}</b><br>${s.title}<button onclick="removeSchedule('${s.date}','${s.time}','${s.title.replaceAll("'","&#39;")}')">Selesai</button></div>`).join('');
  const review = document.getElementById('reviewList');
  review.innerHTML = state.notes.slice(-3).reverse().map(n=>`<p>${n.course} - ${n.title}<br><span>Terakhir diperbarui ${n.updated}</span></p>`).join('');
}
function renderProgress(){
  const courseCount = courses().length;
  const percent = Math.min(100, Math.round((state.notes.length * 18) + (state.schedules.length * 5)));
  document.getElementById('progressNumber').textContent = percent + '%';
  document.getElementById('progressText').textContent = `${state.notes.length} Catatan • ${state.lastRekap ? 1 : 0} Rekap • ${courseCount} Mata Kuliah`;
}

function selectNote(id){ state.activeNoteId = Number(id); renderNotes(); renderMeetings(); }
function newNote(){
  const id = Date.now();
  state.notes.unshift({id, course:'Mata Kuliah Baru', title:'Catatan Baru', content:'Tulis materi kuliah di sini...', favorite:false, updated:new Date().toISOString().slice(0,10)});
  state.activeNoteId = id;
  persist(); renderAll(); location.hash='catatan';
}
function saveNote(){
  let n = activeNote();
  if(!n) return;
  n.course = document.getElementById('noteCourse').value.trim() || 'Tanpa Mata Kuliah';
  n.title = document.getElementById('noteTitle').value.trim() || 'Tanpa Judul';
  n.content = document.getElementById('noteBox').value.trim();
  n.updated = new Date().toISOString().slice(0,10);
  persist(); renderAll();
  document.getElementById('saveStatus').textContent = 'Tersimpan otomatis';
}
function toggleFavorite(){ const n = activeNote(); if(n){ n.favorite=!n.favorite; persist(); renderAll(); } }
function deleteNote(){
  if(state.notes.length <= 1){ alert('Minimal harus ada satu catatan.'); return; }
  state.notes = state.notes.filter(n => n.id != state.activeNoteId);
  state.activeNoteId = state.notes[0].id;
  persist(); renderAll();
}

function summarize(text){
  const clean = text.replace(/\n+/g,' ').trim();
  const sentences = clean.match(/[^.!?]+[.!?]?/g) || [clean];
  return sentences.slice(0,3).map(s=>s.trim()).filter(Boolean);
}
function keywords(text){
  const stop = ['yang','dan','di','ke','dari','atau','adalah','untuk','dengan','pada','dalam','maka','ini','itu','serta','akan','sebagai','karena'];
  const words = text.toLowerCase().replace(/[^a-zA-ZÀ-ÿ0-9\s]/g,' ').split(/\s+/).filter(w=>w.length>4 && !stop.includes(w));
  const freq = {};
  words.forEach(w=>freq[w]=(freq[w]||0)+1);
  return Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,7).map(([w])=>w);
}
function generateRekap(){
  const course = document.getElementById('rekapCourse').value;
  const notes = state.notes.filter(n=>n.course===course);
  const combined = notes.map(n=>`${n.title}. ${n.content}`).join('\n');
  const points = summarize(combined);
  const key = keywords(combined);
  const html = `<p class="inti"><b>Inti:</b> ${points[0] || 'Belum ada isi catatan.'}</p><ol>${points.map(p=>`<li>${p}</li>`).join('')}</ol><h4>KATA KUNCI</h4><p>${key.map(k=>'#'+k).join(' ') || '-'}</p>`;
  document.getElementById('rekapTitle').textContent = 'REKAP: ' + course.toUpperCase();
  document.getElementById('rekapOutput').innerHTML = html;
  state.lastRekap = `REKAP: ${course}\n\nInti: ${points[0] || '-'}\n\nPoin penting:\n${points.map((p,i)=>`${i+1}. ${p}`).join('\n')}\n\nKata kunci: ${key.join(', ')}`;
  document.getElementById('exportPreview').textContent = state.lastRekap;
  persist(); renderProgress();
}
function searchMaterial(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const box = document.getElementById('searchResult');
  if(!q){ box.textContent = 'Masukkan kata kunci terlebih dahulu.'; return; }
  const results = state.notes.filter(n => (n.title+n.course+n.content).toLowerCase().includes(q));
  if(!results.length){ box.innerHTML = 'Materi tidak ditemukan. Coba kata kunci lain.'; return; }
  box.innerHTML = '<b>Hasil pencarian:</b>' + results.map(n=>`<div class="found"><b>${n.course} - ${n.title}</b><br>${n.content.slice(0,180)}...</div>`).join('');
}
function addSchedule(){
  const date = document.getElementById('scheduleDate').value;
  const time = document.getElementById('scheduleTime').value;
  const title = document.getElementById('scheduleTitle').value.trim();
  if(!date || !time || !title){ alert('Tanggal, jam, dan judul jadwal harus diisi.'); return; }
  state.schedules.push({date,time,title});
  document.getElementById('scheduleTitle').value='';
  persist(); renderSchedules(); renderProgress();
}
function removeSchedule(date,time,title){
  state.schedules = state.schedules.filter(s => !(s.date===date && s.time===time && s.title===title));
  persist(); renderSchedules(); renderProgress();
}
function downloadFile(filename, content){
  const blob = new Blob([content], {type:'text/plain;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href);
}
function downloadCurrentNote(){
  const n = activeNote();
  downloadFile('catatan-' + (n.title || 'materi').replace(/\s+/g,'-').toLowerCase() + '.txt', `${n.course}\n${n.title}\n\n${n.content}`);
}
function downloadRekap(){
  if(!state.lastRekap) generateRekap();
  downloadFile('rekap-materi.txt', state.lastRekap || 'Belum ada rekap.');
}

window.addEventListener('keydown', function(e){
  if(e.key==='Enter' && document.getElementById('loginPage').style.display!=='none') loginFromPage();
});
loadData();
