// ====== CONFIG (troque aqui) ======
const WHATS_NUMBER = "5519987723530"; // seu número com DDI+DDD
const WHATS_TEXT_DEFAULT = "Oi! Quero fazer um pedido. Pode me enviar o cardápio?";
const MAPS_LINK = "https://www.google.com/maps?q=-22.355725,-47.322166"; // troque pro link do lugar

// ====== Helpers ======
const moneyBR = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function makeWhatsLink(message){
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATS_NUMBER}?text=${text}`;
}

// ====== Menu mobile ======
const btnMenu = document.getElementById("btnMenu");
const mobileMenu = document.getElementById("mobileMenu");
btnMenu?.addEventListener("click", () => {
  const open = mobileMenu.style.display === "block";
  mobileMenu.style.display = open ? "none" : "block";
});

// ====== Ano no footer ======
document.getElementById("year").textContent = new Date().getFullYear();

// ====== Links (Whats + Maps) ======
const btnWhats = document.getElementById("btnWhats");
const btnWhats2 = document.getElementById("btnWhats2");
btnWhats.href = makeWhatsLink(WHATS_TEXT_DEFAULT);
btnWhats2.href = makeWhatsLink(WHATS_TEXT_DEFAULT);

const btnMaps = document.getElementById("btnMaps");
btnMaps.href = MAPS_LINK;

const mapIframe = document.getElementById("mapIframe");
mapIframe.src = `${MAPS_LINK}&output=embed`;

// ====== Carrinho simples ======
let cart = []; // {name, price, qty}

function addItem(name, price){
  const found = cart.find(i => i.name === name);
  if(found) found.qty += 1;
  else cart.push({ name, price, qty: 1 });
  renderCart();
}

function changeQty(name, delta){
  const item = cart.find(i => i.name === name);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(i => i.name !== name);
  renderCart();
}

function clearCart(){
  cart = [];
  renderCart();
}

function getTotal(){
  return cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
}

function renderCart(){
  const list = document.getElementById("cartList");
  const totalEl = document.getElementById("cartTotal");

  if(cart.length === 0){
    list.innerHTML = `<p class="muted">Ainda vazio. Adicione itens do cardápio.</p>`;
    totalEl.textContent = moneyBR(0);
    return;
  }

  list.innerHTML = cart.map(i => `
    <div class="cartRow">
      <div>
        <b>${i.name}</b><br/>
        <small>${moneyBR(i.price)} • x${i.qty}</small>
      </div>
      <div class="qty">
        <button class="iconBtn" data-minus="${i.name}">-</button>
        <button class="iconBtn" data-plus="${i.name}">+</button>
      </div>
    </div>
  `).join("");

  totalEl.textContent = moneyBR(getTotal());

  // eventos +/-
  list.querySelectorAll("[data-minus]").forEach(btn=>{
    btn.addEventListener("click", ()=> changeQty(btn.dataset.minus, -1));
  });
  list.querySelectorAll("[data-plus]").forEach(btn=>{
    btn.addEventListener("click", ()=> changeQty(btn.dataset.plus, 1));
  });
}

// botões "Adicionar"
document.querySelectorAll(".btnSmall").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);
    addItem(name, price);
  });
});

document.getElementById("clearCart").addEventListener("click", clearCart);

// finalizar pedido
document.getElementById("finishOrder").addEventListener("click", ()=>{
  if(cart.length === 0){
    alert("Seu carrinho está vazio!");
    return;
  }

  const lines = cart.map(i => `- ${i.name} x${i.qty} (${moneyBR(i.price)})`);
  const total = moneyBR(getTotal());

  const msg =
`Oi! Quero fazer um pedido:
${lines.join("\n")}
Total: ${total}

Meu nome: 
Endereço (se for entrega): 
Forma de pagamento:`;

  window.open(makeWhatsLink(msg), "_blank");
});

// primeira renderização
renderCart();
