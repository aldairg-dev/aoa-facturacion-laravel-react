<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    protected static $nextNumber = 1;

    public function definition(): array
    {
        $productNames = [
            'Servicio Consultoría',
            'Licencia Software',
            'Mantenimiento Hardware',
            'Capacitación Online',
            'Soporte Técnico Premium'
        ];

        $code = 'ITEM-' . str_pad(self::$nextNumber, 4, '0', STR_PAD_LEFT);
        self::$nextNumber++;

        return [
            'product_code' => $code,
            'product_name' => $this->faker->randomElement($productNames),
            'unit_price'   => $this->faker->randomFloat(2, 50, 1000),
        ];
    }
}
