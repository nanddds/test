const STORAGE_KEY = 'lecturerCompanionDataV4_FIXED_FLOW';
let state = {
  activeNoteId: 1,
  activeRekapNoteId: 1,
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
  if(!state.activeRekapNoteId || !state.notes.some(n => n.id == state.activeRekapNoteId)) state.activeRekapNoteId = state.notes[0]?.id || 1;
}
function rekapNote(){ return state.notes.find(n => n.id == state.activeRekapNoteId) || state.notes[0]; }

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

function renderAll(){ renderNotes(); renderCourses(); renderRekapOptions(); renderSchedules(); renderProgress(); renderExportOptions(); updateExportPreview(); }
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
  if(notes.length && !notes.some(n => n.id == state.activeRekapNoteId)) state.activeRekapNoteId = notes[0].id;
  list.innerHTML = notes.map((n,i)=>`<p onclick="selectRekapNote(${n.id})" class="${n.id==state.activeRekapNoteId?'active':''}">Pertemuan ${i+1}<br><span>${safeText(n.title.replace(/^Pertemuan\s*\d+\s*-\s*/i,''))}</span></p>`).join('') || '<p>Belum ada catatan.</p>';
  renderRekapNote();
}
function selectRekapNote(id){
  state.activeRekapNoteId = Number(id);
  persist();
  renderMeetings();
}
function changeRekapCourse(){
  const course = document.getElementById('rekapCourse').value;
  const first = state.notes.find(n => n.course === course);
  if(first) state.activeRekapNoteId = first.id;
  persist();
  renderMeetings();
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

function selectNote(id){ state.activeNoteId = Number(id); renderNotes(); renderMeetings(); renderExportOptions(); updateExportPreview(); }
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
  if(!state.activeRekapNoteId) state.activeRekapNoteId = id;
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
function titleWithoutMeeting(n){ return (n?.title || '').replace(/^Pertemuan\s*\d+\s*-\s*/i,''); }
function renderRekapNote(){
  const n = rekapNote();
  if(!n){ return; }
  const title = titleWithoutMeeting(n) || n.title || 'Materi';
  let html = '';
  let text = '';
  if(n.title.toLowerCase().includes('persamaan dasar akuntansi')){
    html = `<p class="inti"><b>Inti:</b> Persamaan dasar akuntansi menjelaskan hubungan antara aset, liabilitas, dan ekuitas.</p>
      <ol>
        <li>Persamaan dasar akuntansi menunjukkan hubungan antara harta perusahaan, kewajiban perusahaan, dan modal pemilik.</li>
        <li>Rumus persamaan dasar akuntansi adalah Aset = Liabilitas + Ekuitas. Contoh: Kas bertambah Rp10.000 maka aset naik.</li>
      </ol>
      <h4>KATA KUNCI</h4><p>#akuntansi #aset #liabilitas #ekuitas #kas</p>`;
    text = `REKAP: ${title}\n\nInti: Persamaan dasar akuntansi menjelaskan hubungan antara aset, liabilitas, dan ekuitas.\n\n1. Persamaan dasar akuntansi menunjukkan hubungan antara harta perusahaan, kewajiban perusahaan, dan modal pemilik.\n2. Rumus persamaan dasar akuntansi adalah Aset = Liabilitas + Ekuitas. Contoh: Kas bertambah Rp10.000 maka aset naik.\n\nKata kunci: akuntansi, aset, liabilitas, ekuitas, kas`;
  }else if(n.title.toLowerCase().includes('siklus akuntansi')){
    html = `<p class="inti"><b>Inti:</b> Siklus akuntansi memastikan proses pencatatan sampai laporan keuangan berjalan runtut dan akurat.</p>
      <ol>
        <li>Transaksi adalah peristiwa ekonomi yang memengaruhi keuangan perusahaan.</li>
        <li>Jurnal menjadi pencatatan pertama transaksi sebelum dipindahkan ke buku besar.</li>
        <li>Buku besar mengelompokkan akun berdasarkan jenisnya.</li>
        <li>Neraca saldo menyajikan daftar saldo akun sebelum penyesuaian.</li>
        <li>Jurnal penyesuaian dibuat di akhir periode agar saldo akun sesuai kondisi sebenarnya.</li>
      </ol>
      <h4>KATA KUNCI</h4><p>#transaksi #jurnal #bukuBesar #neracaSaldo #penyesuaian</p>`;
    text = `REKAP: ${title}\n\nInti: Siklus akuntansi memastikan proses pencatatan sampai laporan keuangan berjalan runtut dan akurat.\n\n1. Transaksi adalah peristiwa ekonomi yang memengaruhi keuangan perusahaan.\n2. Jurnal menjadi pencatatan pertama transaksi sebelum dipindahkan ke buku besar.\n3. Buku besar mengelompokkan akun berdasarkan jenisnya.\n4. Neraca saldo menyajikan daftar saldo akun sebelum penyesuaian.\n5. Jurnal penyesuaian dibuat di akhir periode agar saldo akun sesuai kondisi sebenarnya.\n\nKata kunci: transaksi, jurnal, buku besar, neraca saldo, penyesuaian`;
  }else{
    const points = summarize(n.content);
    const key = keywords(n.content);
    html = `<p class="inti"><b>Inti:</b> ${safeText(points[0] || 'Belum ada isi catatan.')}</p><ol>${points.map(p=>`<li>${safeText(p)}</li>`).join('')}</ol><h4>KATA KUNCI</h4><p>${key.map(k=>'#'+safeText(k)).join(' ') || '-'}</p>`;
    text = `REKAP: ${title}\n\nInti: ${points[0] || '-'}\n\n${points.map((p,i)=>`${i+1}. ${p}`).join('\n')}\n\nKata kunci: ${key.join(', ')}`;
  }
  document.getElementById('rekapTitle').textContent = 'REKAP: ' + title.toUpperCase();
  document.getElementById('rekapOutput').innerHTML = html;
  state.lastRekap = text;
  document.getElementById('exportPreview').textContent = text;
  persist(); renderProgress();
}
function generateRekap(){ renderRekapNote(); }
function searchMaterial(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const box = document.getElementById('searchResult');
  if(!q){ box.textContent = 'Masukkan kata kunci terlebih dahulu.'; return; }
  const terms = q.split(/\s+/).filter(Boolean);
  const results = state.notes.filter(n => terms.some(t => (n.title+' '+n.course+' '+n.content).toLowerCase().includes(t)));
  if(!results.length){ box.innerHTML = 'Materi tidak ditemukan. Coba kata kunci lain.'; return; }
  box.innerHTML = `<b>Hasil pencarian (${results.length} materi):</b>` + results.map(n=>`<div class="found"><b>${safeText(n.course)} - ${safeText(n.title)}</b><br><div>${safeText(n.content).replace(/\n/g,'<br>')}</div></div>`).join('');
}
function bestNoteForQuestion(question){
  const terms = question.toLowerCase().replace(/[^a-z0-9À-ÿ\s]/g,' ').split(/\s+/).filter(w => w.length > 3);
  let scored = state.notes.map(n => {
    const hay = (n.title+' '+n.course+' '+n.content).toLowerCase();
    const score = terms.reduce((sum,t)=> sum + (hay.includes(t) ? 1 : 0), 0);
    return {n, score};
  }).sort((a,b)=>b.score-a.score);
  return scored[0]?.score > 0 ? scored[0].n : null;
}
function answerFromNote(note, question){
  const q = question.toLowerCase();
  if(!note) return 'Aku belum menemukan materi itu di catatan. Coba pakai kata kunci yang ada di catatan, misalnya persamaan dasar akuntansi, siklus akuntansi, aset lancar, atau jurnal penyesuaian.';
  if(q.includes('persamaan') || note.title.toLowerCase().includes('persamaan dasar akuntansi')) return 'Persamaan dasar akuntansi menjelaskan hubungan antara aset, liabilitas, dan ekuitas. Rumusnya adalah Aset = Liabilitas + Ekuitas. Contohnya, jika kas bertambah Rp10.000, maka aset perusahaan ikut naik.';
  if(q.includes('siklus') || note.title.toLowerCase().includes('siklus akuntansi')) return 'Siklus akuntansi adalah urutan proses pencatatan transaksi sampai menjadi laporan keuangan. Urutannya meliputi transaksi, jurnal, buku besar, neraca saldo, jurnal penyesuaian, laporan keuangan, jurnal penutup, dan neraca saldo setelah penutupan.';
  if(q.includes('jurnal penyesuaian')) return 'Jurnal penyesuaian dibuat pada akhir periode untuk menyesuaikan saldo akun agar sesuai dengan kondisi sebenarnya. Contohnya beban yang sudah terjadi tetapi belum dibayar perlu dicatat sebagai beban dan utang.';
  if(q.includes('aset lancar')) return 'Aset lancar adalah aset yang dapat digunakan atau dicairkan dalam waktu kurang dari satu tahun, seperti kas, piutang, dan persediaan. Berbeda dengan aset tidak lancar yang manfaatnya lebih dari satu tahun.';
  return `Aku menemukan materi terkait di ${note.course} - ${note.title}. Ringkasnya: ${summarize(note.content).join(' ')}`;
}
function askLecturerAI(){
  const input = document.getElementById('aiQuestion');
  const box = document.getElementById('aiMessages');
  const question = input.value.trim();
  if(!question) return;
  const note = bestNoteForQuestion(question);
  const answer = answerFromNote(note, question);
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
function selectedExportNote(){
  const id = document.getElementById('exportNotePicker')?.value;
  return state.notes.find(note => String(note.id) === String(id)) || activeNote();
}
function updateExportPreview(){
  const n = selectedExportNote();
  const preview = document.getElementById('exportPreview');
  if(!preview || !n) return;
  preview.textContent = `${n.course}\n${n.title}\n\n${n.content}`;
}
function downloadSelectedNote(){
  const n = selectedExportNote();
  downloadFile('catatan-' + (n.title || 'materi').replace(/\s+/g,'-').toLowerCase() + '.txt', `${n.course}\n${n.title}\n\n${n.content}`);
}
function downloadRekap(){
  renderRekapNote();
  downloadFile('rekap-materi.txt', state.lastRekap || 'Belum ada rekap.');
}

window.addEventListener('keydown', function(e){
  if(e.key==='Enter' && document.getElementById('loginPage').style.display!=='none') loginFromPage();
  if(e.key==='Enter' && document.activeElement?.id === 'aiQuestion') askLecturerAI();
});
loadData();

