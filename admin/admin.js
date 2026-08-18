const firebaseAuth = window.firebaseAuth;
const firebaseDb = window.firebaseDb;

if (!firebaseAuth || !firebaseDb) {
  console.error('Firebase Auth/Database belum tersedia.');
}

const products = [
  {id:1,name:'Kapal Api Mix 23g',category:'Kopi',price:2000},
  {id:2,name:'Luwak White Coffee',category:'Kopi',price:2000},
  {id:3,name:'Indocoffee',category:'Kopi',price:2000},
  {id:5,name:'Indomie Soto / Ayam Bawang',category:'Mie',price:3500},
  {id:6,name:'Indomie Goreng',category:'Mie',price:4000},
  {id:15,name:'Coca-Cola Zero Sugar',category:'Minuman',price:6000},
  {id:22,name:'Telur Negeri Curah',category:'Sembako',price:26000},
  {id:27,name:'Gula Curah',category:'Sembako',price:20000},
  {id:31,name:'Minyak Kita 1L',category:'Sembako',price:23000},
  {id:32,name:'Beras',category:'Sembako',price:15000}
];

const rupiah = n => 'Rp' + Number(n).toLocaleString('id-ID');
let roleCheckInProgress = false;

function setView(loggedIn, user) {
  const login = document.getElementById('loginView');
  const admin = document.getElementById('adminView');
  if (loggedIn && user) {
    login.style.display = 'none';
    login.hidden = true;
    admin.style.display = 'flex';
    admin.hidden = false;
    document.getElementById('adminEmail').textContent = user.email || 'Admin';
    renderProducts();
  } else {
    admin.style.display = 'none';
    admin.hidden = true;
    login.style.display = 'grid';
    login.hidden = false;
  }
}

async function checkAdminRole(user) {
  if (!user || !firebaseAuth || !firebaseDb) return false;
  try {
    await user.reload();
    const current = firebaseAuth.currentUser;
    if (!current || !current.emailVerified) return false;
    const snap = await firebaseDb.ref('users/' + current.uid + '/role').once('value');
    return snap.val() === 'admin';
  } catch (error) {
    console.error('Admin role check failed:', error);
    return false;
  }
}

async function adminLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (!email || !password) return msg('Isi email dan password.');
  msg('Memproses login...');
  try {
    if (!firebaseAuth) return msg('Firebase Auth belum siap. Refresh halaman terlebih dahulu.');
    const credential = await firebaseAuth.signInWithEmailAndPassword(email, password);
    const currentUser = credential.user;
    await currentUser.reload();
    if (!currentUser.emailVerified) {
      await firebaseAuth.signOut();
      return msg('Email akun ini belum diverifikasi. Cek email verifikasi terlebih dahulu.');
    }
    const isAdmin = await checkAdminRole(currentUser);
    if (!isAdmin) {
      await firebaseAuth.signOut();
      return msg('Akun ini bukan admin. Akses admin ditolak.');
    }
    msg('');
    setView(true, firebaseAuth.currentUser);
  } catch (e) {
    console.error(e);
    msg(e.code === 'auth/invalid-credential' ? 'Email atau password salah.' : (e.message || 'Login gagal.'));
    setView(false);
  }
}

function msg(text) {
  const el = document.getElementById('loginMessage');
  if (el) el.textContent = text;
}

async function adminLogout() {
  if (firebaseAuth) await firebaseAuth.signOut();
  setView(false);
}

function showSection(id, button) {
  document.querySelectorAll('.section').forEach(x => x.classList.remove('active-section'));
  document.getElementById(id).classList.add('active-section');
  document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
  button.classList.add('active');
  const names = {dashboard:'Dashboard',products:'Kelola Produk',orders:'Pesanan',users:'Pengguna',laundry:'Self Laundry'};
  document.getElementById('pageTitle').textContent = names[id] || 'Admin';
}

function renderProducts() {
  const count = document.getElementById('productCount');
  const list = document.getElementById('productList');
  if (count) count.textContent = products.length;
  if (!list) return;
  list.innerHTML = products.map(p => `<div class="product-row"><div><b>${p.name}</b><br><small>${p.category} · ${rupiah(p.price)}</small></div><button onclick="alert('Form edit produk akan ditambahkan pada tahap berikutnya.')">Edit</button></div>`).join('');
}

function addProduct() {
  alert('Form tambah produk akan kita sambungkan ke Firebase Database setelah struktur admin selesai.');
}

setView(false);

if (firebaseAuth) {
  firebaseAuth.onAuthStateChanged(async user => {
    if (roleCheckInProgress) return;
    if (!user) {
      setView(false);
      return;
    }
    roleCheckInProgress = true;
    const isAdmin = await checkAdminRole(user);
    const currentUser = firebaseAuth.currentUser;
    roleCheckInProgress = false;
    if (isAdmin && currentUser) {
      setView(true, currentUser);
    } else {
      await firebaseAuth.signOut();
      setView(false);
      msg(user.emailVerified === false ? 'Email akun ini belum diverifikasi.' : 'Akun ini bukan admin. Akses admin ditolak.');
    }
  });
}