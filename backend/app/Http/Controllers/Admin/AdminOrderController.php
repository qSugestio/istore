<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Services\OrderService;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class AdminOrderController extends Controller
{
    public function __construct(
        private OrderService $orderService
    ) {}

    public function index(): JsonResponse
    {
        $orders = Order::with(['user', 'items.product'])
            ->latest()
            ->paginate(15);

        return response()->json($orders);
    }

    public function show(string $id): JsonResponse
    {
        $order = Order::with(['user', 'items.product'])->findOrFail($id);
        return response()->json($order);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, string $id): JsonResponse
    {
        $order = Order::findOrFail($id);
        $order = $this->orderService->updateOrderStatus($order, $request->status);
        return response()->json($order);
    }
}
