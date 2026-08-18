(() => {
  const auth = window.firebaseAuth;
  const firebaseDb = window.firebaseDb;

  if (!auth || !firebaseDb) {
    console.error('Firebase Auth/Database belum tersedia.');
    return;
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
    if (!login || !admin) return;
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
    if (!user) return false;
    try {
      await user.reload();
      const current = auth.currentUser;
      if (!current || !current.emailVerified) return false;
      const snap = await firebaseDb.ref('users/' + current.uid + '/role').once('value');
      return snap.val() === 'admin';
    } catch (error) {
      console.error('Admin role check failed:', error);
      return false;
    }
  }

  window.adminLogin = async function adminLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if (!email || !password) return msg('Isi email dan password.');
    msg('Memproses login...');
    try {
      const credential = await auth.signInWithEmailAndPassword(email, password);
      const currentUser = credential.user;
      await currentUser.reload();
      if (!currentUser.emailVerified) {
        await auth.signOut();
        return msg('Email akun ini belum diverifikasi. Cek email verifikasi terlebih dahulu.');
      }
      const isAdmin = await checkAdminRole(currentUser);
      if (!isAdmin) {
        await auth.signOut();
        return msg('Akun ini bukan admin. Akses admin ditolak.');
      }
      msg('');
      setView(true, auth.currentUser);
    } catch (e) {
      console.error('Admin login error:', e);
      const code = e && e.code ? e.code : '';
      if (code === 'auth/api-key-not-valid') {
        msg('Konfigurasi Firebase API key tidak valid. Refresh halaman setelah perubahan Firebase selesai.');
      } else if (code === 'auth/invalid-credential') {
        msg('Email atau password salah.');
      } else {
        msg(e.message || 'Login gagal.');
      }
      setView(false);
    }
  };

  function msg(text) {
    const el = document.getElementById('loginMessage');
    if (el) el.textContent = text;
  }

  window.adminLogout = async function adminLogout() {
    await auth.signOut();
    setView(false);
  };

  window.showSection = function showSection(id, button) {
    document.querySelectorAll('.section').forEach(x => x.classList.remove('active-section'));
    document.getElementById(id).classList.add('active-section');
    document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
    button.classList.add('active');
    const names = {dashboard:'Dashboard',products:'Kelola Produk',orders:'Pesanan',users:'Pengguna',laundry:'Self Laundry'};
    document.getElementById('pageTitle').textContent = names[id] || 'Admin';
  };

  function renderProducts() {
    const count = document.getElementById('productCount');
    const list = document.getElementById('productList');
    if (count) count.textContent = products.length;
    if (!list) return;
    list.innerHTML = products.map(p => `<div class="product-row"><div><b>${p.name}</b><br><small>${p.category} · ${rupiah(p.price)}</small></div><button type="button" onclick="alert('Form edit produk akan ditambahkan pada tahap berikutnya.')">Edit</button></div>`).join('');
  }

  window.addProduct = function addProduct() {
    alert('Form tambah produk akan kita sambungkan ke Firebase Database setelah struktur admin selesai.');
  };

  setView(false);

  auth.onAuthStateChanged(async user => {
    if (roleCheckInProgress) return;
    if (!user) {
      setView(false);
      return;
    }
    roleCheckInProgress = true;
    const isAdmin = await checkAdminRole(user);
    const currentUser = auth.currentUser;
    roleCheckInProgress = false;
    if (isAdmin && currentUser) {
      setView(true, currentUser);
    } else {
      await auth.signOut();
      setView(false);
      msg(user.emailVerified === false ? 'Email akun ini belum diverifikasi.' : 'Akun ini bukan admin. Akses admin ditolak.');
    }
  });
})();
