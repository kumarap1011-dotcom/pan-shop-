// ══════════════════════════════════════════
// PanShop — Shared State & Utilities
// ══════════════════════════════════════════

// ── AUTH ──────────────────────────────────
var STAFF = [
  { id:'S1', name:'Ravi Patel',   role:'owner',   pin:'1234', avatar:'RP' },
  { id:'S2', name:'Kiran Shah',   role:'cashier', pin:'5678', avatar:'KS' },
  { id:'S3', name:'Meena Joshi',  role:'cashier', pin:'9012', avatar:'MJ' },
];

function getSession(){ try{ return JSON.parse(sessionStorage.getItem('ps_session')||'null'); }catch(e){return null;} }
function setSession(s){ sessionStorage.setItem('ps_session', JSON.stringify(s)); }
function clearSession(){ sessionStorage.removeItem('ps_session'); }
function requireAuth(page){
  var s=getSession();
  if(!s){ window.location='login.html'; return null; }
  if(page==='dashboard' && s.role!=='owner'){ window.location='pos.html'; return null; }
  return s;
}

// ── MENU DATA ──────────────────────────────
var MENU = {
  "Classic Paan": [
    { id:'P01', name:'Meetha Paan',       price:20,  desc:'Sweet rose, gulkand, mukhwas',      emoji:'🍃', popular:true },
    { id:'P02', name:'Sadha Paan',        price:15,  desc:'Simple betel with lime & katha',     emoji:'🌿', popular:false },
    { id:'P03', name:'Banarasi Paan',     price:35,  desc:'Authentic Varanasi style, chuna',    emoji:'🍃', popular:true },
    { id:'P04', name:'Calcutta Paan',     price:30,  desc:'Mishri, rose water, saunf',          emoji:'🌿', popular:false },
  ],
  "Premium Paan": [
    { id:'P05', name:'Chocolate Paan',    price:60,  desc:'Dark chocolate coating, meetha fill',emoji:'🍫', popular:true },
    { id:'P06', name:'Fire Paan',         price:80,  desc:'Edible silver, flame finish',        emoji:'🔥', popular:true },
    { id:'P07', name:'Ice Cream Paan',    price:70,  desc:'Vanilla ice cream wrapped in paan',  emoji:'🍦', popular:false },
    { id:'P08', name:'Gold Paan',         price:150, desc:'24K gold leaf, dry fruits, premium', emoji:'✨', popular:false },
  ],
  "Tobacco Paan": [
    { id:'P09', name:'Zarda Paan',        price:25,  desc:'Zarda tobacco blend',                emoji:'🌱', popular:false },
    { id:'P10', name:'Khaini Special',    price:20,  desc:'Khaini with lime & areca nut',       emoji:'🌿', popular:false },
    { id:'P11', name:'Gutka Paan',        price:30,  desc:'Special tobacco mix, strong',        emoji:'🍃', popular:false },
  ],
  "Mukhwas & Extras": [
    { id:'P12', name:'Saunf Mix',         price:15,  desc:'Fennel seeds, candied mix',           emoji:'🌾', popular:false },
    { id:'P13', name:'Elaichi Packet',    price:10,  desc:'Green cardamom pods',                 emoji:'💚', popular:false },
    { id:'P14', name:'Premium Mukhwas',   price:25,  desc:'Special house blend, 10 ingredients', emoji:'🌟', popular:true },
    { id:'P15', name:'Tambul Special',    price:40,  desc:'Chef special paan masala combo',      emoji:'🎁', popular:false },
  ],
  "Drinks": [
    { id:'D01', name:'Rose Sharbat',      price:30,  desc:'Chilled rose drink',                 emoji:'🌹', popular:false },
    { id:'D02', name:'Thandai',           price:50,  desc:'Cold milk, nuts, saffron',           emoji:'🥛', popular:true },
    { id:'D03', name:'Paan Shake',        price:60,  desc:'Paan flavoured thick shake',         emoji:'🥤', popular:true },
    { id:'D04', name:'Masala Soda',       price:25,  desc:'Jeera, black salt, lemon',           emoji:'🫧', popular:false },
  ],
};

// Flatten menu
function getAllItems(){
  var all=[];
  Object.keys(MENU).forEach(function(cat){
    MENU[cat].forEach(function(item){ all.push(Object.assign({},item,{category:cat})); });
  });
  return all;
}

// ── STORAGE (simulate DB) ──────────────────
function getOrders(){ try{ return JSON.parse(localStorage.getItem('ps_orders')||'[]'); }catch(e){return[];} }
function saveOrders(o){ localStorage.setItem('ps_orders',JSON.stringify(o)); }
function getOnlineOrders(){ try{ return JSON.parse(localStorage.getItem('ps_online_orders')||'[]'); }catch(e){return[];} }
function saveOnlineOrders(o){ localStorage.setItem('ps_online_orders',JSON.stringify(o)); }

function saveOrder(order){
  var orders=getOrders();
  order.id = 'INV'+Date.now();
  order.ts = Date.now();
  order.date = new Date().toLocaleDateString('en-IN');
  order.time = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  orders.push(order);
  saveOrders(orders);
  return order.id;
}

// ── FORMAT HELPERS ─────────────────────────
function rs(n){ return '₹'+(Math.round(n)||0).toLocaleString('en-IN'); }
function fmt(n){ return (Math.round(n)||0).toLocaleString('en-IN'); }
function pct(n,t){ return t?Math.round((n/t)*100):0; }

// ── SEED sample data if empty ──────────────
(function seedIfEmpty(){
  if(getOrders().length) return;
  var items=getAllItems();
  var methods=['Cash','UPI','Card'];
  var staffNames=['Ravi Patel','Kiran Shah','Meena Joshi'];
  var orders=[];
  var now=Date.now();
  for(var d=29;d>=0;d--){
    var base=now-(d*86400000);
    var count=3+Math.floor(Math.random()*8);
    for(var t=0;t<count;t++){
      var pick=[];
      var numItems=1+Math.floor(Math.random()*4);
      for(var i=0;i<numItems;i++){
        var item=items[Math.floor(Math.random()*items.length)];
        var qty=1+Math.floor(Math.random()*3);
        pick.push({id:item.id,name:item.name,price:item.price,qty:qty,category:item.category});
      }
      var sub=pick.reduce(function(s,i){return s+i.price*i.qty},0);
      var gst=Math.round(sub*0.05);
      var dt=new Date(base+t*3600000);
      orders.push({
        id:'INV'+(base+t),
        ts: base+t*3600000,
        date:dt.toLocaleDateString('en-IN'),
        time:dt.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),
        items:pick, subtotal:sub, gst:gst, total:sub+gst,
        payment:methods[Math.floor(Math.random()*3)],
        staff:staffNames[Math.floor(Math.random()*3)],
        customer:''
      });
    }
  }
  saveOrders(orders);
})();
