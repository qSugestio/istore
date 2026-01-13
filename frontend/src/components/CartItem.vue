<script setup lang="ts">
import { CartItem } from '../shared/api/cart'
import Button from './Button.vue'

interface Props {
  item: CartItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updateQuantity: [id: number, quantity: number]
  remove: [id: number]
}>()

const handleQuantityChange = (delta: number) => {
  const newQuantity = props.item.quantity + delta
  if (newQuantity > 0) {
    emit('updateQuantity', props.item.id, newQuantity)
  }
}

const handleRemove = () => {
  emit('remove', props.item.id)
}
</script>

<template>
  <div class="cart-item">
    <div class="cart-item-info">
      <h4>{{ item.product.name }}</h4>
      <p class="cart-item-price">${{ Number(item.product.price).toFixed(2) }}</p>
    </div>
    <div class="cart-item-controls">
      <div class="quantity-controls">
        <button @click="handleQuantityChange(-1)" class="qty-btn">-</button>
        <span class="quantity">{{ item.quantity }}</span>
        <button @click="handleQuantityChange(1)" class="qty-btn">+</button>
      </div>
      <p class="cart-item-total">
        ${{ (Number(item.product.price) * item.quantity).toFixed(2) }}
      </p>
      <Button variant="danger" @click="handleRemove">Remove</Button>
    </div>
  </div>
</template>

<style scoped>
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;

  color: #2c3e50;
}

.cart-item-info {
  flex: 1;
}

.cart-item-info h4 {
  margin: 0 0 0.5rem 0;
}

.cart-item-price {
  margin: 0;
  color: #7f8c8d;
}

.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;

  color: #2c3e50;
}

.qty-btn:hover {
  background: #f5f5f5;
}

.quantity {
  min-width: 40px;
  text-align: center;
  font-weight: 500;
}

.cart-item-total {
  font-weight: bold;
  font-size: 1.1rem;
  min-width: 80px;
  text-align: right;
}
</style>
