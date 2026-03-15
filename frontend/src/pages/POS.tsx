import { useState, useEffect } from 'react';
import { Search, Trash2, CheckCircle, Plus, Minus } from 'lucide-react';
import api from '../services/api';
import './POS.css';

interface Product {
    id: string;
    name: string;
    selling_price: number | string;
    stock_quantity: number;
}

interface CartItem extends Product {
    qty: number;
}

export default function POS() {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Espèces');

    const searchProducts = async (term: string) => {
        if (!term) {
            setProducts([]);
            return;
        }
        try {
            setLoading(true);
            const response = await api.get(`/medications?search=${term}`);
            setProducts(response.data);
        } catch (err) {
            console.error('Error searching products', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            searchProducts(searchTerm);
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    const addToCart = (product: Product) => {
        if (Number(product.stock_quantity) <= 0) return;

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const total = cart.reduce((acc, item) => acc + (Number(item.selling_price) * item.qty), 0);

    const handleCheckout = async () => {
        if (cart.length === 0 || isProcessing) return;

        try {
            setIsProcessing(true);
            const payload = {
                items: cart.map(item => ({
                    medication_id: item.id,
                    quantity: item.qty,
                    unit_price: Number(item.selling_price)
                })),
                total_amount: total,
                payment_method: paymentMethod
            };

            await api.post('/sales', payload);
            alert('Vente enregistrée avec succès !');
            setCart([]);
            setSearchTerm('');
        } catch (err) {
            console.error('Checkout error', err);
            alert('Erreur lors de l\'enregistrement de la vente.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="pos-page">
            <div className="pos-products glass-panel">
                <div className="pos-search">
                    <Search size={20} className="pos-search-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher un médicament..."
                        className="pos-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="pos-results">
                    {loading ? (
                        <div className="pos-loading">Recherche en cours...</div>
                    ) : products.length > 0 ? (
                        <div className="quick-items-grid">
                            {products.map(product => (
                                <div
                                    className={`quick-item-card ${Number(product.stock_quantity) <= 0 ? 'disabled' : ''}`}
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                >
                                    <h4>{product.name}</h4>
                                    <p>{Number(product.selling_price).toLocaleString()} FCFA</p>
                                    <span className={Number(product.stock_quantity) <= 0 ? 'text-danger' : ''}>
                                        Stock: {product.stock_quantity}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="pos-placeholder">
                            {searchTerm ? 'Aucun résultat trouvé.' : 'Utilisez la barre de recherche pour trouver des produits.'}
                        </div>
                    )}
                </div>
            </div>

            <div className="pos-cart glass-panel">
                <div className="cart-header">
                    <h2>Panier Actuel</h2>
                    <span className="cart-count">
                        {cart.reduce((a, b) => a + b.qty, 0)} articles
                    </span>
                </div>

                <div className="cart-items">
                    {cart.map((item) => (
                        <div className="cart-item" key={item.id}>
                            <div className="item-info">
                                <h4>{item.name}</h4>
                                <p>{Number(item.selling_price).toLocaleString()} FCFA</p>
                            </div>
                            <div className="item-actions">
                                <div className="qty-controls">
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQty(item.id, -1)}
                                        title="Diminuer"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="qty-value">{item.qty}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQty(item.id, 1)}
                                        title="Augmenter"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={() => removeFromCart(item.id)}
                                    title="Supprimer"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <div className="summary-row total">
                        <span>Total à Payer</span>
                        <span>{total.toLocaleString()} FCFA</span>
                    </div>
                </div>

                <div className="cart-actions">
                    <select
                        className="payment-method"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        title="Mode de paiement"
                    >
                        <option>Espèces</option>
                        <option>Mobile Money</option>
                        <option>Carte Bancaire</option>
                        <option>Assurance</option>
                    </select>
                    <div className="action-buttons">
                        <button className="btn btn-primary flex-2 btn-lg" onClick={handleCheckout} disabled={cart.length === 0 || isProcessing}>
                            <CheckCircle size={20} />
                            {isProcessing ? 'Traitement...' : 'Encaisser'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
