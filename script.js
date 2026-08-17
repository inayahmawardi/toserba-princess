const products=[
{id:1,name:'Kapal Api Mix 23g',category:'Kopi',price:2000,unit:'Saset',emoji:'☕'},
{id:2,name:'Luwak White Coffee',category:'Kopi',price:2000,unit:'Saset',emoji:'☕'},
{id:3,name:'Indocoffee',category:'Kopi',price:2000,unit:'Saset',emoji:'☕'},
{id:4,name:'ABC Susu',category:'Kopi',price:2000,unit:'Saset',emoji:'☕'},
{id:5,name:'Indomie Soto / Ayam Bawang',category:'Mie',price:3500,unit:'Mentah',emoji:'🍜'},
{id:6,name:'Indomie Goreng',category:'Mie',price:4000,unit:'Mentah',emoji:'🍜'},
{id:7,name:'Pop Mie Aneka Rasa',category:'Mie',price:8000,unit:'Cup',emoji:'🥡'},
{id:9,name:'Wipol 720g',category:'Rumah Tangga',price:30000,unit:'Botol',emoji:'🧴'},
{id:10,name:'Sasa Tepung Bumbu Hot Spicy 210g',category:'Bahan Masakan',price:8000,unit:'Pcs',emoji:'🌶️'},
{id:11,name:'Indofood Racik Bakwan 210g',category:'Bahan Masakan',price:8000,unit:'Pcs',emoji:'🥣'},
{id:12,name:'Sasa Tepung Pisang 210g',category:'Bahan Masakan',price:8000,unit:'Pcs',emoji:'🍌'},
{id:13,name:'Racik Tepung Bumbu Serbaguna',category:'Bahan Masakan',price:8000,unit:'Pcs',emoji:'🥣'},
{id:14,name:'3 Ayam Mie Telor 200g',category:'Mie',price:6000,unit:'Pcs',emoji:'🍝'},
{id:15,name:'Coca-Cola Zero Sugar',category:'Minuman',price:6000,unit:'Botol',emoji:'🥤'},
{id:16,name:'Saori Saus Tiram 270ml',category:'Bahan Masakan',price:25000,unit:'Botol',emoji:'🍶'},
{id:17,name:'Fruit Tea 350ml',category:'Minuman',price:7000,unit:'Botol',emoji:'🧃'},
{id:19,name:'Lasegar 320ml Aneka Rasa',category:'Minuman',price:8000,unit:'Botol',emoji:'🥤'},
{id:20,name:'Maya Sarden Saus Tomat 155g',category:'Bahan Masakan',price:14000,unit:'Kaleng',emoji:'🥫'},
{id:21,name:'Lasegar Twic Leci Lemon 320ml',category:'Minuman',price:9000,unit:'Botol',emoji:'🥤'},
{id:22,name:'Telur Negeri Curah',category:'Sembako',price:26000,unit:'Kg',emoji:'🥚'},
{id:23,name:'Fanta Strawberry 390ml',category:'Minuman',price:6000,unit:'Botol',emoji:'🥤'},
{id:24,name:'Ultra Milk Low Fat 250ml',category:'Minuman',price:10000,unit:'Kotak',emoji:'🥛'},
{id:25,name:'Cincau Pandan 350ml',category:'Minuman',price:8000,unit:'Botol',emoji:'🧋'},
{id:26,name:'Kopi Golda Botol',category:'Minuman',price:5000,unit:'Botol',emoji:'☕'},
{id:27,name:'Gula Curah',category:'Sembako',price:20000,unit:'Kg',emoji:'🧂'},
{id:28,name:'Energen Coklat / Vanila',category:'Kopi',price:2000,unit:'Saset',emoji:'🥛'},
{id:29,name:'Susu Bendera Saset',category:'Kopi',price:2000,unit:'Saset',emoji:'🥛'},
{id:30,name:'Larutan Kaki Tiga Kecil',category:'Minuman',price:5000,unit:'Botol',emoji:'🥤'},
{id:31,name:'Minyak Kita 1L',category:'Sembako',price:23000,unit:'Liter',emoji:'🫗'},
{id:32,name:'Beras',category:'Sembako',price:15000,unit:'Liter',emoji:'🍚'}
];
let selectedCategory='Semua';let cart=[];
const rupiah=n=>'Rp'+n.toLocaleString('id-ID');
function renderCategories(){const cats=['Semua',...new Set(products.map(p=>p.category))];document.getElementById('categories').innerHTML=cats.map(c=>`<button class="category ${selectedCategory===c?'active':''}" onclick="selectCategory('${c}')">${c}</button>`).join('')}
function selectCategory(c){selectedCategory=c;renderCategories();renderProducts()}
function renderProducts(){const q=(document.getElementById('searchInput')?.value||'').toLowerCase();const list=products.filter(p=>(selectedCategory==='Semua'||p.category===selectedCategory)&&p.name.toLowerCase().includes(q));document.getElementById('productGrid').innerHTML=list.map(p=>`<article class="product-card"><div class="product-image">${p.emoji}</div><div class="product-info"><small>${p.category} · ${p.unit}</small><h3>${p.name}</h3><strong>${rupiah(p.price)}</strong><button class="add-btn" onclick="addToCart(${p.id})">+ Keranjang</button></div></article>`).join('')||'<p>Produk tidak ditemukan.</p>'}
function addToCart(id){const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({...p,qty:1});updateCart();toast(`${p.name} ditambahkan ke keranjang`)}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);updateCart()}
function updateCart(){document.getElementById('cartCount').textContent=cart.reduce((a,b)=>a+b.qty,0);document.getElementById('cartItems').innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><div><strong>${x.name}</strong><br><small>${x.qty} × ${rupiah(x.price)}</small></div><button onclick="removeFromCart(${x.id})">Hapus</button></div>`).join(''):'<p>Keranjang masih kosong.</p>';document.getElementById('cartTotal').textContent=rupiah(cart.reduce((a,b)=>a+b.price*b.qty,0))}
function openCart(){document.getElementById('cartDrawer').classList.add('open');document.getElementById('overlay').classList.add('show');updateCart()}
function closeCart(){document.getElementById('cartDrawer').classList.remove('open');document.getElementById('overlay').classList.remove('show')}
function checkout(){if(!cart.length)return toast('Keranjang masih kosong');toast('Checkout WhatsApp akan kita aktifkan setelah nomor toko diisi.')}
function showLaundryInfo(){alert('Cara Self Laundry:\n1. Pilih mesin yang tersedia.\n2. Masukkan pakaian sesuai kapasitas.\n3. Pilih program cuci.\n4. Lakukan pembayaran sesuai layanan.\n5. Pantau waktu hingga proses selesai.\n\nStatus mesin real-time akan dikembangkan pada tahap berikutnya.')}
function toggleMenu(){document.getElementById('nav').classList.toggle('open')}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
renderCategories();renderProducts();updateCart();