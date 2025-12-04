// Cart Management Utilities
class CartManager {
  constructor() {
    this.cartKey = 'cc_cart';
    this.deliveryCharge = 200;
    this.freeShippingThreshold = 4000;
    this.listeners = [];
  }

  updateSettings(shippingFee, freeShippingThreshold) {
    this.deliveryCharge = shippingFee || 200;
    this.freeShippingThreshold = freeShippingThreshold || 4000;
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.getCart()));
  }

  getCart() {
    try {
      const raw = localStorage.getItem(this.cartKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Error loading cart:', e);
      return [];
    }
  }

  setCart(items) {
    try {
      localStorage.setItem(this.cartKey, JSON.stringify(items));
      this.notify();
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }

  addToCart(product) {
    try {
      const cart = this.getCart();
      const productId = product.id || product._id;
      
      // Check if same product with same color and size exists
      const existingItem = cart.find(item => 
        item.id === productId && 
        item.selectedColor === product.selectedColor &&
        item.selectedSize === product.selectedSize
      );

      if (existingItem) {
        existingItem.qty = (existingItem.qty || 1) + 1;
      } else {
        cart.push({
          id: productId,
          name: product.name,
          price: product.price,
          img: product.mainImage || product.img,
          qty: 1,
          selectedColor: product.selectedColor || '',
          selectedSize: product.selectedSize || ''
        });
      }

      this.setCart(cart);
      return cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return this.getCart();
    }
  }

  removeFromCart(productId) {
    const cart = this.getCart().filter(item => item.id !== productId);
    this.setCart(cart);
    return cart;
  }

  updateQuantity(productId, newQty) {
    try {
      const cart = this.getCart();
      const item = cart.find(item => item.id === productId);

      if (item) {
        if (newQty <= 0) {
          return this.removeFromCart(productId);
        } else {
          item.qty = Math.max(1, parseInt(newQty) || 1);
          this.setCart(cart);
        }
      }

      return cart;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return this.getCart();
    }
  }

  getTotalItems() {
    return this.getCart().reduce((total, item) => total + (item.qty || 1), 0);
  }

  getCartTotal() {
    return this.getCart().reduce((total, item) => {
      return total + (item.price * (item.qty || 1));
    }, 0);
  }

  getDeliveryCharge() {
    if (this.getCart().length === 0) return 0;
    const cartTotal = this.getCartTotal();
    return cartTotal >= this.freeShippingThreshold ? 0 : this.deliveryCharge;
  }

  qualifiesForFreeDelivery() {
    return this.getCartTotal() >= this.freeShippingThreshold;
  }

  getFreeShippingThreshold() {
    return this.freeShippingThreshold;
  }

  getTotalWithDelivery() {
    return this.getCartTotal() + this.getDeliveryCharge();
  }

  clearCart() {
    this.setCart([]);
  }
}

export const cartManager = new CartManager();
