<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartRequest;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $cartItems = Cart::where('user_id', $request->user()->id)
            ->with('product')
            ->get();

        $total = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        return response()->json([
            'items' => $cartItems,
            'total' => $total,
        ]);
    }

    public function add(AddToCartRequest $request): JsonResponse
    {
        $user = $request->user();
        $product = Product::findOrFail($request->product_id);

        if ($product->stock < $request->quantity) {
            return response()->json([
                'message' => 'Insufficient stock',
            ], 422);
        }

        $cartItem = Cart::updateOrCreate(
            [
                'user_id' => $user->id,
                'product_id' => $product->id,
            ],
            [
                'quantity' => $request->quantity,
            ]
        );

        return response()->json($cartItem->load('product'), 201);
    }

    public function update(UpdateCartRequest $request, string $id): JsonResponse
    {
        $cartItem = Cart::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $product = $cartItem->product;
        if ($product->stock < $request->quantity) {
            return response()->json([
                'message' => 'Insufficient stock',
            ], 422);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json($cartItem->load('product'));
    }

    public function remove(Request $request, string $id): JsonResponse
    {
        $cartItem = Cart::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart']);
    }

    public function clear(Request $request): JsonResponse
    {
        Cart::where('user_id', $request->user()->id)->delete();

        return response()->json(['message' => 'Cart cleared']);
    }
}
