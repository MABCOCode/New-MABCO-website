export function saveCart(cart: any) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function loadCart() {
  const raw = localStorage.getItem('cart');
  return raw ? JSON.parse(raw) : [];
}
