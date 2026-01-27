import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 py-6 border-b border-gray-100 last:border-0">
            {/* Image */}
            <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                <p className="text-gray-500 text-sm">Unit: {item.unit}</p>
                <p className="text-primary font-bold mt-1">KES {item.price}</p>
            </div>

            {/* Quantity */}
            <div className="flex items-center border border-gray-200 rounded-full px-3 py-1 bg-white">
                <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 hover:text-red-500 transition-colors"
                >
                    <Minus size={16} />
                </button>
                <span className="mx-3 font-semibold text-gray-800">{item.quantity}</span>
                <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 hover:text-green-500 transition-colors"
                >
                    <Plus size={16} />
                </button>
            </div>

            {/* Total & Remove */}
            <div className="flex items-center gap-6">
                <span className="font-bold text-gray-900 w-24 text-right">KES {item.price * item.quantity}</span>
                <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-full hover:bg-red-50"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
