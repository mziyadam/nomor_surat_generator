const daftarSuratBtn = document.getElementById('daftar-surat')
daftarSuratBtn.addEventListener('click', () => {
    const childWindow = window.open('daftar_surat/daftar-surat.html', 'modal','maximizable: false,resizable: false')
})

const buatNomorSuratBaruBtn = document.getElementById('buat-nomor-surat-baru')
buatNomorSuratBaruBtn.addEventListener('click', () => {
    const childWindow = window.open('buat_nomor_surat_baru/buat-nomor-surat-baru.html', 'modal','maximizable: false,resizable: false')
})