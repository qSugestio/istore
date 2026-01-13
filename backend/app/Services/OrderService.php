<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\User;
use App\Jobs\SendOrderNotification;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function createOrder(User $user, array $data): Order
    {
        return DB::transaction(function () use ($user, $data) {
            $cartItems = Cart::where('user_id', $user->id)
                ->with('product')
                ->get();

            if ($cartItems->isEmpty()) {
                throw new \Exception('Cart is empty');
            }

            $total = $cartItems->sum(function ($item) {
                return $item->product->price * $item->quantity;
            });

            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'total' => $total,
                'address' => $data['address'],
                'phone' => $data['phone'],
            ]);

            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price,
                ]);

                $cartItem->product->decrement('stock', $cartItem->quantity);
            }

            Cart::where('user_id', $user->id)->delete();

            SendOrderNotification::dispatch($order);

            return $order->load('items.product');
        });
    }

    public function updateOrderStatus(Order $order, string $status): Order
    {
        $order->update(['status' => $status]);
        return $order->load('items.product', 'user');
    }
}
