const STORAGE_KEY = 'lecturerCompanionDataV3_PATCHED';
let state = {
  activeNoteId: 1,
  notes: [
    {id:1, course:'Akuntansi Keuangan', title:'Pertemuan 1 - Persamaan Dasar Akuntansi', content:'Persamaan Dasar Akuntansi\n\n1. Persamaan dasar akuntansi menunjukkan hubungan antara aset, liabilitas, dan ekuitas.\n2. Rumus persamaan dasar akuntansi adalah Aset = Liabilitas + Ekuitas. Contoh: Kas bertambah Rp10.000 maka aset naik.', favorite:true, updated:'2026-06-11'},
    {id:2, course:'Perpajakan', title:'PPh Pasal 23', content:'PPh Pasal 23 terutang pada akhir bulan pembayaran, disediakan untuk dibayar, atau jatuh tempo pembayaran. Penyetoran paling lambat tanggal 10 bulan berikutnya dan SPT Masa dilaporkan paling lambat tanggal 20 setelah masa pajak berakhir.', favorite:false, updated:'2026-06-10'},
    {id:3, course:'Akuntansi Keuangan', title:'Pertemuan 2 - Siklus Akuntansi', content:'Siklus akuntansi adalah tahapan pencatatan transaksi keuangan dari awal sampai tersusun laporan keuangan. Tahapannya meliputi transaksi, jurnal, buku besar, neraca saldo, jurnal penyesuaian, laporan keuangan, jurnal penutup, dan neraca saldo setelah penutupan. Siklus akuntansi membantu memastikan laporan keuangan disusun secara sistematis dan akurat.', favorite:false, updated:'2026-06-09'}
  ],
  schedules: [
    {date:'2026-06-12', time:'08:00', title:'Review Akuntansi Keuangan'},
    {date:'2026-06-14', time:'10:00', title:'Latihan Perpajakan'}
  ],
  reviewNoteIds: [1,3],
  lastRekap: ''
};

function loadData(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved){
    try{ state = JSON.parse(saved); }catch(e){}
  }
  if(!Array.isArray(state.reviewNoteIds)) state.reviewNoteIds = [1,3].filter(id => state.notes.some(n => n.id === id));
}
function persist(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function courses(){ return [...new Set(state.notes.map(n => n.course).filter(Boolean))]; }
function activeNote(){ return state.notes.find(n => n.id == state.activeNoteId) || state.notes[0]; }
function safeText(text){ return String(text ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }

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

function renderAll(){ renderNotes(); renderCourses(); renderRekapOptions(); renderSchedules(); renderProgress(); renderExportOptions(); }
function renderNotes(){
  const q = (document.getElementById('noteSearchTop')?.value || '').toLowerCase();
  const picker = document.getElementById('notePicker');
  if(!picker) return;
  const filtered = state.notes.filter(n => (n.title+n.course+n.content).toLowerCase().includes(q));
  picker.innerHTML = filtered.map(n => `<option value="${n.id}">${n.favorite?'★ ':''}${safeText(n.course)} - ${safeText(n.title)}</option>`).join('');
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
  ul.innerHTML = courses().map(c => `<li>${safeText(c)} <b>${state.notes.filter(n=>n.course===c).length}</b></li>`).join('');
}
function renderRekapOptions(){
  const select = document.getElementById('rekapCourse');
  const current = select.value;
  select.innerHTML = courses().map(c => `<option>${safeText(c)}</option>`).join('');
  if(current && courses().includes(current)) select.value = current;
  renderMeetings();
}
function renderMeetings(){
  const course = document.getElementById('rekapCourse')?.value || courses()[0];
  const list = document.getElementById('meetingList');
  const notes = state.notes.filter(n=>n.course===course);
  list.innerHTML = notes.map((n,i)=>`<p class="${n.id==state.activeNoteId?'active':''}">Pertemuan ${i+1}<br><span>${safeText(n.title.replace(/^Pertemuan\s*\d+\s*-\s*/i,''))}</span></p>`).join('') || '<p>Belum ada catatan.</p>';
}
function renderSchedules(){
  const box = document.getElementById('scheduleList');
  const sorted = [...state.schedules].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  box.innerHTML = sorted.map(s=>`<div class="schedule-item"><b>${safeText(s.date)} ${safeText(s.time)}</b><br>${safeText(s.title)}<button onclick="removeSchedule('${String(s.date).replaceAll("'","&#39;")}','${String(s.time).replaceAll("'","&#39;")}','${String(s.title).replaceAll("'","&#39;")}')">Selesai</button></div>`).join('');
  renderReviewList();
}
function renderReviewList(){
  const picker = document.getElementById('reviewPicker');
  const review = document.getElementById('reviewList');
  if(!picker || !review) return;
  const available = state.notes.filter(n => !state.reviewNoteIds.includes(n.id));
  picker.innerHTML = available.map(n => `<option value="${n.id}">${safeText(n.course)} - ${safeText(n.title)}</option>`).join('') || '<option value="">Semua materi sudah masuk review</option>';
  const items = state.reviewNoteIds.map(id => state.notes.find(n => n.id == id)).filter(Boolean);
  review.innerHTML = items.length ? items.map(n=>`<label class="review-item"><input type="checkbox" onchange="completeReviewMaterial(${n.id})"><span><b>${safeText(n.course)} - ${safeText(n.title)}</b><br><small>Terakhir diperbarui ${safeText(n.updated)}</small></span></label>`).join('') : '<p>Belum ada materi yang perlu direview.</p>';
}
function renderProgress(){
  const courseCount = courses().length;
  const percent = Math.min(100, Math.round((state.notes.length * 18) + (state.schedules.length * 5)));
  document.getElementById('progressNumber').textContent = percent + '%';
  document.getElementById('progressText').textContent = `${state.notes.length} Catatan • ${state.lastRekap ? 1 : 0} Rekap • ${courseCount} Mata Kuliah`;
}
function renderExportOptions(){
  const select = document.getElementById('exportNotePicker');
  if(!select) return;
  const current = select.value;
  select.innerHTML = state.notes.map(n => `<option value="${n.id}">${safeText(n.course)} - ${safeText(n.title)}</option>`).join('');
  if(current && state.notes.some(n => String(n.id) === String(current))) select.value = current;
}

function selectNote(id){ state.activeNoteId = Number(id); renderNotes(); renderMeetings(); renderExportOptions(); }
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
  state.reviewNoteIds = state.reviewNoteIds.filter(id => id != state.activeNoteId);
  state.activeNoteId = state.notes[0].id;
  persist(); renderAll();
}
function addReviewMaterial(){
  const id = Number(document.getElementById('reviewPicker').value);
  if(!id) return;
  if(!state.reviewNoteIds.includes(id)) state.reviewNoteIds.push(id);
  persist(); renderReviewList();
}
function completeReviewMaterial(id){
  state.reviewNoteIds = state.reviewNoteIds.filter(noteId => noteId != id);
  persist(); renderReviewList();
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
  const key = keywords(combined);
  let html = '';
  let text = '';
  if(course === 'Akuntansi Keuangan'){
    html = `<p class="inti"><b>Inti:</b> Akuntansi Keuangan mencakup persamaan dasar akuntansi dan siklus akuntansi sebagai dasar penyusunan laporan keuangan.</p>
      <ol>
        <li>Persamaan dasar akuntansi menunjukkan hubungan antara aset, liabilitas, dan ekuitas.</li>
        <li>Siklus akuntansi adalah tahapan pencatatan transaksi dari jurnal, buku besar, neraca saldo, penyesuaian, sampai laporan keuangan.</li>
      </ol>
      <h4>KATA KUNCI</h4><p>#persamaan #aset #liabilitas #ekuitas #siklus #jurnal</p>`;
    text = 'REKAP: Akuntansi Keuangan\n\nInti: Akuntansi Keuangan mencakup persamaan dasar akuntansi dan siklus akuntansi sebagai dasar penyusunan laporan keuangan.\n\nPoin penting:\n1. Persamaan dasar akuntansi menunjukkan hubungan antara aset, liabilitas, dan ekuitas.\n2. Siklus akuntansi adalah tahapan pencatatan transaksi dari jurnal, buku besar, neraca saldo, penyesuaian, sampai laporan keuangan.\n\nKata kunci: persamaan, aset, liabilitas, ekuitas, siklus, jurnal';
  }else{
    const points = summarize(combined);
    html = `<p class="inti"><b>Inti:</b> ${safeText(points[0] || 'Belum ada isi catatan.')}</p><ol>${points.map(p=>`<li>${safeText(p)}</li>`).join('')}</ol><h4>KATA KUNCI</h4><p>${key.map(k=>'#'+safeText(k)).join(' ') || '-'}</p>`;
    text = `REKAP: ${course}\n\nInti: ${points[0] || '-'}\n\nPoin penting:\n${points.map((p,i)=>`${i+1}. ${p}`).join('\n')}\n\nKata kunci: ${key.join(', ')}`;
  }
  document.getElementById('rekapTitle').textContent = 'REKAP: ' + course.toUpperCase();
  document.getElementById('rekapOutput').innerHTML = html;
  state.lastRekap = text;
  document.getElementById('exportPreview').textContent = state.lastRekap;
  persist(); renderProgress();
}
function searchMaterial(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const box = document.getElementById('searchResult');
  if(!q){ box.textContent = 'Masukkan kata kunci terlebih dahulu.'; return; }
  const results = state.notes.filter(n => (n.title+n.course+n.content).toLowerCase().includes(q));
  if(!results.length){ box.innerHTML = 'Materi tidak ditemukan. Coba kata kunci lain.'; return; }
  box.innerHTML = '<b>Hasil pencarian:</b>' + results.map(n=>`<div class="found"><b>${safeText(n.course)} - ${safeText(n.title)}</b><br>${safeText(n.content.slice(0,180))}...</div>`).join('');
}
function askLecturerAI(){
  const input = document.getElementById('aiQuestion');
  const box = document.getElementById('aiMessages');
  const question = input.value.trim();
  if(!question) return;
  const q = question.toLowerCase();
  const matches = state.notes.filter(n => (n.title + ' ' + n.course + ' ' + n.content).toLowerCase().includes(q) || q.split(/\s+/).some(w => w.length > 4 && (n.title+n.content).toLowerCase().includes(w)));
  let answer = '';
  if(q.includes('jurnal penyesuaian')){
    answer = 'Jurnal penyesuaian adalah jurnal yang dibuat pada akhir periode untuk menyesuaikan saldo akun agar mencerminkan kondisi sebenarnya. Contohnya, jika beban gaji sudah terjadi tetapi belum dibayar, maka dicatat Beban Gaji pada debit dan Utang Gaji pada kredit.';
  }else if(q.includes('siklus akuntansi')){
    answer = 'Siklus akuntansi adalah proses pencatatan transaksi sampai menjadi laporan keuangan. Tahap umumnya adalah transaksi, jurnal, buku besar, neraca saldo, jurnal penyesuaian, laporan keuangan, jurnal penutup, dan neraca saldo setelah penutupan.';
  }else if(q.includes('aset lancar')){
    answer = 'Aset lancar adalah aset yang diperkirakan dapat dicairkan atau digunakan dalam waktu kurang dari satu tahun, misalnya kas, piutang, dan persediaan. Aset tidak lancar digunakan lebih dari satu tahun, misalnya tanah, gedung, dan peralatan.';
  }else if(matches.length){
    const n = matches[0];
    answer = `Aku menemukan materi terkait di ${n.course} - ${n.title}. Ringkasnya: ${summarize(n.content).join(' ')}`;
  }else{
    answer = 'Materi itu belum ditemukan di catatan. Coba gunakan kata kunci lain, misalnya aset lancar, siklus akuntansi, atau jurnal penyesuaian.';
  }
  box.innerHTML += `<p class="user">${safeText(question)}</p><p class="bot">${safeText(answer)}</p>`;
  input.value = '';
  box.scrollTop = box.scrollHeight;
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
function downloadSelectedNote(){
  const id = document.getElementById('exportNotePicker').value;
  const n = state.notes.find(note => String(note.id) === String(id)) || activeNote();
  downloadFile('catatan-' + (n.title || 'materi').replace(/\s+/g,'-').toLowerCase() + '.txt', `${n.course}\n${n.title}\n\n${n.content}`);
}
function downloadRekap(){
  if(!state.lastRekap) generateRekap();
  downloadFile('rekap-materi.txt', state.lastRekap || 'Belum ada rekap.');
}

window.addEventListener('keydown', function(e){
  if(e.key==='Enter' && document.getElementById('loginPage').style.display!=='none') loginFromPage();
  if(e.key==='Enter' && document.activeElement?.id === 'aiQuestion') askLecturerAI();
});
loadData();
