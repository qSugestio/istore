<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrderRequest;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()
            ->orders()
            ->with('items.product')
            ->latest()
            ->paginate(15);

        return response()->json($orders);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $order = $request->user()
            ->orders()
            ->with('items.product')
            ->findOrFail($id);

        return response()->json($order);
    }

    public function store(CreateOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->createOrder(
            $request->user(),
            $request->validated()
        );

        return response()->json($order, 201);
    }
}
