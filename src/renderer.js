// const setButton = document.getElementById('btn')
// const titleInput = document.getElementById('title')
// setButton.addEventListener('click', () => {
//     const title = titleInput.value
//     window.electronAPI.setTitle(title)
// })

const daftarSuratBtn = document.getElementById('daftar-surat')
daftarSuratBtn.addEventListener('click', () => {
    const childWindow = window.open('daftar_surat/daftar-surat.html', 'modal')
})

const buatNomorSuratBaruBtn = document.getElementById('buat-nomor-surat-baru')
buatNomorSuratBaruBtn.addEventListener('click', () => {
    const childWindow = window.open('buat_nomor_surat_baru/buat-nomor-surat-baru.html', 'modal')
})