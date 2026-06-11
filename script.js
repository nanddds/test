const defaultNotes = [
  {
    id: 1,
    subject: 'Akuntansi Keuangan',
    title: 'Pertemuan 1 - Pengantar Akuntansi',
    favorite: true,
    body: 'Pengantar akuntansi membahas proses pencatatan, penggolongan, peringkasan, dan pelaporan informasi keuangan. Akuntansi membantu pengguna laporan keuangan memahami kondisi perusahaan.'
  },
  {
    id: 2,
    subject: 'Akuntansi Keuangan',
    title: 'Pertemuan 2 - Persamaan Dasar Akuntansi',
    favorite: false,
    body: '1. Persamaan dasar akuntansi adalah Aset = Liabilitas + Ekuitas.\n2. Contoh: Kas bertambah Rp10.000 maka aset naik. Utang bertambah Rp10.000 maka liabilitas naik.'
  },
  {
    id: 3,
    subject: 'Akuntansi Keuangan',
    title: 'Pertemuan 3 - Siklus Akuntansi',
    favorite: true,
    body: 'Siklus akuntansi adalah tahapan pencatatan transaksi sampai menjadi laporan keuangan. Tahapannya meliputi transaksi, jurnal, buku besar, neraca saldo, jurnal penyesuaian, dan laporan keuangan.'
  },
  {
    id: 4,
    subject: 'Akuntansi Keuangan',
    title: 'Pertemuan 4 - Jurnal Penyesuaian',
    favorite: false,
    body: 'Jurnal penyesuaian dibuat pada akhir periode untuk menyesuaikan akun agar sesuai dengan kondisi sebenarnya. Contohnya beban gaji terutang, asuransi dibayar di muka, dan penyusutan aset tetap.'
  },
  {
    id: 5,
    subject: 'Perpajakan',
    title: 'Perpajakan - Pertemuan 2',
    favorite: false,
    body: 'Pajak adalah kontribusi wajib kepada negara yang bersifat memaksa berdasarkan undang-undang dan digunakan untuk keperluan negara bagi kemakmuran rakyat.'
  }
];

let notes = JSON.parse(localStorage.getItem('lc_notes') || 'null') || defaultNotes;
let schedules = JSON.parse(localStorage.getItem('lc_schedules') || 'null') || [
  {date:'Besok, 08:00', title:'Akuntansi Keuangan - Pertemuan 4'},
  {date:'14 Nov, 10:00', title:'Audit - UTS'}
];
let reviewItems = JSON.parse(localStorage.getItem('lc_review') || 'null') || [
  'Perpajakan - Pertemuan 2',
  'Sistem Informasi - Pertemuan 1',
  'Akuntansi Keuangan - Siklus Akuntansi'
];
let selectedNoteId = notes[0]?.id || 1;

const rekapData = {
  pengantar: {
    title: 'REKAP: PENGANTAR AKUNTANSI',
    items: [
      ['Pengertian Akuntansi', 'Akuntansi adalah proses mencatat, mengelompokkan, meringkas, dan melaporkan informasi keuangan.'],
      ['Tujuan Akuntansi', 'Tujuannya adalah menyediakan informasi keuangan yang berguna bagi pemilik, manajemen, investor, dan pihak lain.']
    ],
    inti: 'Akuntansi membantu pengguna laporan keuangan mengambil keputusan berdasarkan data keuangan.'
  },
  persamaan: {
    title: 'REKAP: PERSAMAAN DASAR AKUNTANSI',
    items: [
      ['Rumus Dasar', 'Persamaan dasar akuntansi adalah Aset = Liabilitas + Ekuitas.'],
      ['Contoh Perubahan', 'Kas bertambah Rp10.000 maka aset naik. Utang bertambah Rp10.000 maka liabilitas naik.']
    ],
    inti: 'Setiap transaksi harus tetap menjaga keseimbangan antara aset, liabilitas, dan ekuitas.'
  },
  siklus: {
    title: 'REKAP: SIKLUS AKUNTANSI',
    items: [
      ['Transaksi', 'Peristiwa ekonomi yang memengaruhi keuangan perusahaan dan menjadi dasar pencatatan akuntansi.'],
      ['Jurnal', 'Pencatatan pertama transaksi ke dalam jurnal umum berdasarkan bukti transaksi.'],
      ['Buku Besar', 'Pengelompokan akun berdasarkan jenisnya agar saldo tiap akun dapat diketahui.'],
      ['Neraca Saldo', 'Daftar saldo semua akun sebelum dilakukan penyesuaian pada akhir periode.'],
      ['Jurnal Penyesuaian', 'Penyesuaian akun agar saldo sesuai dengan kondisi sebenarnya sebelum laporan keuangan dibuat.']
    ],
    inti: 'Siklus akuntansi memastikan laporan keuangan tersusun secara runtut, lengkap, dan akurat.'
  },
  penyesuaian: {
    title: 'REKAP: JURNAL PENYESUAIAN',
    items: [
      ['Pengertian', 'Jurnal penyesuaian dibuat di akhir periode untuk menyesuaikan saldo akun.'],
      ['Contoh', 'Contohnya beban yang masih harus dibayar, pendapatan diterima di muka, dan penyusutan aset tetap.']
    ],
    inti: 'Jurnal penyesuaian membuat laporan keuangan lebih sesuai dengan keadaan sebenarnya.'
  }
};

function persist(){
  localStorage.setItem('lc_notes', JSON.stringify(notes));
  localStorage.setItem('lc_schedules', JSON.stringify(schedules));
  localStorage.setItem('lc_review', JSON.stringify(reviewItems));
}
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
    setTimeout(showApp,350);
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
function currentNote(){ return notes.find(n => n.id === selectedNoteId) || notes[0]; }
function renderNoteList(){
  const keyword = document.getElementById('noteSearch')?.value.toLowerCase() || '';
  const list = document.getElementById('noteList');
  if(!list) return;
  list.innerHTML = notes.filter(n => (n.title+n.subject+n.body).toLowerCase().includes(keyword)).map(n =>
    `<button class="note-chip ${n.id===selectedNoteId?'active':''}" onclick="selectNote(${n.id})">${n.favorite?'★':'☆'} ${n.title}</button>`
  ).join('');
  document.getElementById('allCount').textContent = notes.length;
  document.getElementById('favCount').textContent = notes.filter(n=>n.favorite).length;
  document.getElementById('dashNotes').textContent = notes.length;
}
function selectNote(id){
  selectedNoteId = id;
  const n = currentNote();
  document.getElementById('subjectInput').value = n.subject;
  document.getElementById('noteTitle').value = n.title;
  document.getElementById('noteBox').value = n.body;
  document.getElementById('favBtn').textContent = n.favorite ? '★ Favorit' : '☆ Jadikan Favorit';
  renderNoteList();
}
function newNote(){
  const id = Date.now();
  notes.unshift({id, subject:'Akuntansi Keuangan', title:'Catatan Baru', favorite:false, body:'Tulis materi kuliah di sini...'});
  selectedNoteId = id;
  persist(); renderAll(); location.hash='catatan';
}
function saveNote(){
  const n = currentNote();
  n.subject = document.getElementById('subjectInput').value;
  n.title = document.getElementById('noteTitle').value || 'Tanpa Judul';
  n.body = document.getElementById('noteBox').value;
  persist(); renderAll();
  document.getElementById('saveInfo').textContent='Catatan berhasil disimpan.';
}
function toggleFavorite(){
  const n=currentNote(); n.favorite=!n.favorite; persist(); renderAll();
}
function deleteNote(){
  if(notes.length<=1){ alert('Minimal harus ada satu catatan.'); return; }
  notes = notes.filter(n=>n.id!==selectedNoteId);
  selectedNoteId = notes[0].id;
  persist(); renderAll();
}
function showRekap(){
  const key=document.getElementById('rekapSelect').value;
  const data=rekapData[key];
  document.querySelectorAll('.meetings p').forEach((el,i)=>el.classList.toggle('active', ['pengantar','persamaan','siklus','penyesuaian'][i]===key));
  document.getElementById('rekapOutput').innerHTML = `<h3>${data.title}</h3><ol>${data.items.map(item=>`<li><b>${item[0]}</b><br>${item[1]}</li>`).join('')}</ol><p class="inti">Inti: ${data.inti}</p>`;
}
function selectRekap(key){ document.getElementById('rekapSelect').value=key; showRekap(); }
function generateRekap(){ showRekap(); alert('Rekap berhasil dibuat berdasarkan materi yang dipilih.'); }
function renderSchedules(){
  document.getElementById('scheduleList').innerHTML = schedules.map(s=>`<p><b>${s.date}</b><br>${s.title}</p>`).join('');
}
function addSchedule(){
  const date=document.getElementById('scheduleDate').value.trim();
  const title=document.getElementById('scheduleTitle').value.trim();
  if(!date || !title){ alert('Isi tanggal dan judul jadwal dulu.'); return; }
  schedules.push({date,title}); persist(); renderSchedules();
  document.getElementById('scheduleDate').value=''; document.getElementById('scheduleTitle').value='';
}
function renderReview(){
  document.getElementById('reviewList').innerHTML = reviewItems.map((item,i)=>`<label class="review-item"><input type="checkbox" onchange="completeReview(${i})"> ${item}</label>`).join('') || '<p>Semua materi review sudah selesai.</p>';
}
function completeReview(index){ reviewItems.splice(index,1); persist(); renderReview(); }
function searchMaterial(){
  const q=document.getElementById('searchInput').value.toLowerCase();
  const matches=notes.filter(n=>(n.title+n.subject+n.body).toLowerCase().includes(q));
  document.getElementById('searchResult').innerHTML = matches.length ? matches.map(n=>`<b>${n.subject}</b><br>${n.title}<br>${n.body.slice(0,180)}...`).join('<hr>') : 'Materi tidak ditemukan di catatan.';
}
function askAI(){
  const input=document.getElementById('aiInput');
  const q=input.value.trim();
  if(!q) return;
  const box=document.getElementById('aiMessages');
  box.innerHTML += `<p class="user">${escapeHtml(q)}</p>`;
  const answer = getLocalAIAnswer(q);
  box.innerHTML += `<p class="bot">${answer}</p>`;
  input.value=''; box.scrollTop=box.scrollHeight;
}
function getLocalAIAnswer(q){
  const text=q.toLowerCase();
  if(text.includes('jurnal penyesuaian')) return 'Jurnal penyesuaian adalah jurnal yang dibuat pada akhir periode untuk menyesuaikan saldo akun. Contohnya beban gaji yang belum dibayar dicatat sebagai beban gaji pada debit dan utang gaji pada kredit.';
  if(text.includes('aset lancar')) return 'Aset lancar adalah aset yang dapat dicairkan atau digunakan dalam waktu kurang dari satu tahun, misalnya kas, piutang, dan persediaan. Aset tidak lancar digunakan lebih dari satu tahun, misalnya tanah, gedung, dan peralatan.';
  if(text.includes('siklus')) return 'Siklus akuntansi dimulai dari transaksi, lalu dicatat ke jurnal, diposting ke buku besar, disusun neraca saldo, dibuat jurnal penyesuaian, lalu disusun laporan keuangan.';
  const match=notes.find(n=>(n.title+n.body).toLowerCase().includes(text.split(' ')[0] || text));
  return match ? `Aku menemukan materi terkait di catatan <b>${match.title}</b>: ${match.body.slice(0,220)}...` : 'Aku belum menemukan jawaban spesifik di catatan lokal. Coba gunakan kata kunci seperti aset lancar, siklus akuntansi, atau jurnal penyesuaian.';
}
function renderExportChoices(){
  const wrap=document.getElementById('exportChoices');
  wrap.innerHTML = notes.map(n=>`<label><input type="checkbox" class="exportCheck" value="${n.id}" checked onchange="updatePreview()"> ${n.title}</label>`).join('');
  updatePreview();
}
function selectedExportNotes(){
  return [...document.querySelectorAll('.exportCheck:checked')].map(ch=>notes.find(n=>n.id==ch.value)).filter(Boolean);
}
function updatePreview(){
  const selected=selectedExportNotes();
  document.getElementById('exportPreview').innerHTML = selected.map(n=>`<h3>${n.title}</h3><p><b>${n.subject}</b></p><p>${escapeHtml(n.body).replace(/\n/g,'<br>')}</p><hr>`).join('') || '<p>Belum ada materi yang dipilih.</p>';
}
function downloadSelected(type){
  const selected=selectedExportNotes();
  if(!selected.length){ alert('Pilih minimal satu materi.'); return; }
  const content = selected.map(n=>`${n.title}\n${n.subject}\n\n${n.body}`).join('\n\n====================\n\n');
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Ekspor Catatan</title></head><body>${selected.map(n=>`<h2>${n.title}</h2><p><b>${n.subject}</b></p><p>${escapeHtml(n.body).replace(/\n/g,'<br>')}</p><hr>`).join('')}</body></html>`;
  const blob=new Blob([type==='html'?html:content],{type:type==='html'?'text/html':'text/plain'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=type==='html'?'ekspor-catatan.html':'ekspor-catatan.txt';
  a.click();
}
function escapeHtml(str){ return str.replace(/[&<>"]/g, s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])); }
function renderAll(){ renderNoteList(); selectNote(selectedNoteId); showRekap(); renderSchedules(); renderReview(); renderExportChoices(); }
window.addEventListener('keydown', function(e){ if(e.key==='Enter' && document.getElementById('loginPage').style.display!=='none'){ loginFromPage(); } });
