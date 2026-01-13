<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Smartphone X', 'slug' => 'smartphone-x', 'description' => 'Latest smartphone with advanced features', 'price' => 599.99, 'stock' => 50, 'category_id' => 1],
            ['name' => 'Laptop Pro', 'slug' => 'laptop-pro', 'description' => 'High-performance laptop for professionals', 'price' => 1299.99, 'stock' => 30, 'category_id' => 1],
            ['name' => 'Wireless Headphones', 'slug' => 'wireless-headphones', 'description' => 'Premium noise-cancelling headphones', 'price' => 199.99, 'stock' => 75, 'category_id' => 1],
            ['name' => 'Smart Watch', 'slug' => 'smart-watch', 'description' => 'Feature-rich smartwatch', 'price' => 299.99, 'stock' => 40, 'category_id' => 1],
            ['name' => 'Tablet Air', 'slug' => 'tablet-air', 'description' => 'Lightweight tablet for everyday use', 'price' => 449.99, 'stock' => 25, 'category_id' => 1],
            ['name' => 'T-Shirt Classic', 'slug' => 'tshirt-classic', 'description' => 'Comfortable cotton t-shirt', 'price' => 19.99, 'stock' => 100, 'category_id' => 2],
            ['name' => 'Jeans Slim Fit', 'slug' => 'jeans-slim-fit', 'description' => 'Modern slim-fit jeans', 'price' => 49.99, 'stock' => 80, 'category_id' => 2],
            ['name' => 'Winter Jacket', 'slug' => 'winter-jacket', 'description' => 'Warm winter jacket', 'price' => 89.99, 'stock' => 60, 'category_id' => 2],
            ['name' => 'Running Shoes', 'slug' => 'running-shoes', 'description' => 'Comfortable running shoes', 'price' => 79.99, 'stock' => 90, 'category_id' => 2],
            ['name' => 'Programming Guide', 'slug' => 'programming-guide', 'description' => 'Complete guide to programming', 'price' => 29.99, 'stock' => 120, 'category_id' => 3],
            ['name' => 'Design Patterns Book', 'slug' => 'design-patterns-book', 'description' => 'Essential design patterns reference', 'price' => 39.99, 'stock' => 70, 'category_id' => 3],
            ['name' => 'Garden Tools Set', 'slug' => 'garden-tools-set', 'description' => 'Complete garden tools collection', 'price' => 59.99, 'stock' => 45, 'category_id' => 4],
            ['name' => 'Indoor Plant Pot', 'slug' => 'indoor-plant-pot', 'description' => 'Decorative plant pot', 'price' => 14.99, 'stock' => 150, 'category_id' => 4],
            ['name' => 'Basketball', 'slug' => 'basketball', 'description' => 'Official size basketball', 'price' => 24.99, 'stock' => 65, 'category_id' => 5],
            ['name' => 'Yoga Mat', 'slug' => 'yoga-mat', 'description' => 'Premium yoga mat', 'price' => 34.99, 'stock' => 55, 'category_id' => 5],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
