<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import CartItem from '../components/CartItem.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorMessage from '../components/ErrorMessage.vue';
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';

const router = useRouter();
const cartStore = useCartStore();

const address = ref('');
const phone = ref('');
const creatingOrder = ref(false);
const orderError = ref<string | null>(null);

onMounted(async () => {
  await cartStore.fetchCart();
});

const handleUpdateQuantity = async (id: number, quantity: number) => {
  await cartStore.updateQuantity(id, quantity);
};

const handleRemove = async (id: number) => {
  await cartStore.removeFromCart(id);
};

const handleCheckout = async () => {
  if (!address.value || !phone.value) {
    orderError.value = 'Please fill in all fields';
    return;
  }

  creatingOrder.value = true;
  orderError.value = null;

  try {
    const { ordersApi } = await import('../shared/api/orders');
    const order = await ordersApi.createOrder({
      address: address.value,
      phone: phone.value,
    });
    await cartStore.clearCart();
    router.push(`/orders/${order.id}`);
  } catch (err: any) {
    console.error('Checkout error:', err);
    orderError.value = err.response?.data?.message || 'Failed to create order';
  } finally {
    creatingOrder.value = false;
  }
};
</script>

<template>
  <div class="cart-page">
    <h1>Shopping Cart</h1>

    <LoadingSpinner v-if="cartStore.loading" message="Loading cart..." />
    <ErrorMessage v-else-if="cartStore.error" :message="cartStore.error" />

    <div v-else-if="cartStore.items.length === 0" class="empty-cart">
      <p>Your cart is empty.</p>
      <router-link to="/products" class="shop-link">Continue Shopping</router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <CartItem
          v-for="item in cartStore.items"
          :key="item.id"
          :item="item"
          @update-quantity="handleUpdateQuantity"
          @remove="handleRemove"
        />
      </div>

      <div class="cart-summary">
        <h2>Order Summary</h2>
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${{ cartStore.total.toFixed(2) }}</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>${{ cartStore.total.toFixed(2) }}</span>
        </div>

        <div class="checkout-form">
          <h3>Shipping Information</h3>
          <ErrorMessage v-if="orderError" :message="orderError" />
          <Input
            v-model="address"
            label="Address"
            id="address"
            placeholder="Enter your address"
          />
          <Input
            v-model="phone"
            label="Phone"
            id="phone"
            placeholder="Enter your phone number"
          />
          <Button
            type="button"
            :loading="creatingOrder"
            @click="handleCheckout"
            class="checkout-btn"
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.empty-cart {
  text-align: center;
  padding: 3rem;
}

.shop-link {
  display: inline-block;
  margin-top: 1rem;
  color: #3498db;
  text-decoration: none;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.cart-items {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.cart-summary {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  height: fit-content;
}

.cart-summary h2 {
  margin-top: 0;
  color: #2c3e50;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #ddd;
  color: #2c3e50;
}

.summary-row.total {
  font-weight: bold;
  font-size: 1.2rem;
  border-bottom: none;
  margin-top: 0.5rem;
}

.checkout-form {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #ddd;
}

.checkout-form h3 {
  margin-top: 0;
  color: #2c3e50;
}

.checkout-form label {
  color: #2c3e50;
}

.checkout-btn {
  width: 100%;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
}
</style>
