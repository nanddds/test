function openLogin(){document.getElementById('loginModal').style.display='flex'}
function closeLogin(){document.getElementById('loginModal').style.display='none'}
function login(){
  const u=document.getElementById('username').value.trim();
  const p=document.getElementById('password').value.trim();
  const info=document.getElementById('loginInfo');
  if(u==='mahasiswa'&&p==='123456'){
    info.textContent='Login berhasil. Selamat datang, Mahasiswa!';
    setTimeout(closeLogin,900);
  }else{info.textContent='Username atau password salah. Gunakan mahasiswa / 123456';}
}
function newNote(){
  document.getElementById('noteBox').value='Judul Catatan\n\nTulis materi kuliah di sini...';
  location.hash='catatan';
}
function generateRekap(){alert('Rekap berhasil dibuat berdasarkan catatan yang tersedia.');}
function searchMaterial(){
  const q=document.getElementById('searchInput').value;
  document.getElementById('searchResult').innerHTML='<b>Hasil pencarian:</b><br>Materi ditemukan untuk kata kunci: '+q+'<br><br>Perbedaan utama aset lancar dan tidak lancar terletak pada jangka waktu realisasinya.';
}
function downloadText(){
  const content='REKAP MATERI\nAkuntansi Keuangan\n\nPersamaan Dasar Akuntansi\nAset = Liabilitas + Ekuitas\n\nSiklus Akuntansi\n1. Transaksi\n2. Jurnal\n3. Buku Besar\n4. Neraca Saldo\n5. Jurnal Penyesuaian';
  const blob=new Blob([content],{type:'text/plain'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='rekap-materi.txt';
  a.click();
}
