let cart = [];

// تحميل مكتبة Supabase تلقائياً
function loadSupabaseScript() {
    return new Promise((resolve, reject) => {
        if (window.supabase) {
            resolve(window.supabase);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => resolve(window.supabase);
        script.onerror = () => reject(new Error('فشل تحميل مكتبة Supabase'));
        document.head.appendChild(script);
    });
}

async function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    try {
        const supabaseLib = await loadSupabaseScript();
        const SUPABASE_URL = 'https://ogsvoxbgxjezirjwiemb.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc3ZveGJneGplemlyandpZW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMjkyNjMsImV4cCI6MjEwNDgwNTI2M30.vxMmDln8Kp9cLE4_tsfAhRaOMEQIU97e5X4z--IxoS8';

        const _supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_KEY);

        const { data: products, error } = await _supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;
        if (!products || products.length === 0) return;

        container.innerHTML = '';

        products.forEach(product => {
            // هنا يقرأ المقاسات التي تكتبها أنت في قاعدة البيانات (سواء في حقل size أو sizes)
            // مثلاً إذا كتبتها هكذا: 41, 42, 43
            let rawSizes = product.size || product.sizes || '37, 38, 39, 40';
            let availableSizes = rawSizes.toString().split(',').map(s => s.trim());

            let sizesHtml = '<div class="sizes-container" style="display: flex; gap: 6px; margin: 8px 0; flex-wrap: wrap;">';
            availableSizes.forEach(s => {
                sizesHtml += `<button type="button" class="size-btn" style="padding: 6px 10px; border: 1px solid #333; background: #fff; color: #000; cursor: pointer; border-radius: 4px; font-size: 12px; font-weight: bold;" onclick="selectSize(this, '${product.id}', '${s}')">${s}</button>`;
            });
            sizesHtml += '</div>';

            const productHTML = `
                <article class="product-card" data-product-id="${product.id}" style="background: #fff; border-radius: 8px; padding: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
                    <div class="product-image" style="height: 200px; overflow: hidden; border-radius: 6px;">
                        <img src="${product.image_url || 'images/product-1.jpg'}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="product-info" style="padding-top: 10px;">
                        <p class="product-category" style="font-size: 11px; color: #888;">KOUIM LUXURY</p>
                        <h3 style="font-size: 18px; margin: 5px 0;">${product.name}</h3>
                        <p class="product-price" style="font-weight: bold; color: #000; font-size: 16px; margin-bottom: 5px;">${product.price ? product.price.toLocaleString() + ' DA' : ''}</p>
                        
                        <label style="font-size: 12px; font-weight: bold; color: #333; display: block; margin-top: 5px;">Choisissez la taille :</label>
                        ${sizesHtml}

                        <button class="add-cart" style="width: 100%; background: #000; color: #fff; border: none; padding: 12px; border-radius: 6px; cursor: pointer; margin-top: 10px; font-weight: bold;" onclick="addToCart('${product.id}', '${product.name}', ${product.price || 0})">
                            Ajouter au panier
                        </button>
                    </div>
                </article>
            `;
            container.innerHTML += productHTML;
        });

    } catch (err) {
        console.error('Error loading products:', err);
    }
}

// دالة اختيار المقاس وتلوين الزر بالأسود
window.selectedSizes = {};
function selectSize(button, productId, size) {
    const card = button.closest('.product-card');
    card.querySelectorAll('.size-btn').forEach(btn => {
        btn.style.background = '#fff';
        btn.style.color = '#000';
    });
    button.style.background = '#000';
    button.style.color = '#fff';
    window.selectedSizes[productId] = size;
}

// دالة الإضافة إلى السلة والتحقق من أن الزبون اختار المقاس
function addToCart(productId, name, price) {
    const chosenSize = window.selectedSizes[productId];
    if (!chosenSize) {
        alert("Veuillez choisir une taille d'abord ! (الرجاء اختيار المقاس أولاً)");
        return;
    }

    cart.push({
        cartId: Date.now(),
        id: productId,
        name: name,
        price: price,
        size: chosenSize
    });

    updateCartCount();
    alert(`Succès ! ${name} (Taille: ${chosenSize}) a été ajouté au panier.`);
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.innerText = cart.length;
    }
}

// نافذة السلة الجانبية وإتمام الطلب عبر واتساب
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    if (!document.getElementById('cart-modal')) {
        const cartModalHTML = `
            <div id="cart-modal" style="position: fixed; top: 0; right: -400px; width: 350px; height: 100%; background: #fff; box-shadow: -5px 0 15px rgba(0,0,0,0.1); z-index: 1000; transition: right 0.3s ease; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                    <h3>Votre Panier</h3>
                    <button id="close-cart-btn" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                <div id="cart-items-container" style="flex: 1; overflow-y: auto; padding: 15px 0;">
                    <p style="color: #777; text-align: center;">Votre panier est vide.</p>
                </div>
                <div style="border-top: 1px solid #eee; padding-top: 15px;">
                    <p id="cart-total" style="font-weight: bold; margin-bottom: 10px;">Total : 0 DA</p>
                    <button style="width: 100%; background: #25D366; color: #fff; border: none; padding: 12px; border-radius: 6px; font-weight: bold; cursor: pointer;" onclick="checkoutWhatsApp()">Commander via WhatsApp</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', cartModalHTML);
    }

    const cartButton = document.querySelector('.cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');

    if (cartButton && cartModal) {
        cartButton.addEventListener('click', () => {
            cartModal.style.right = '0';
            updateCartUI();
        });
    }

    if (closeCartBtn && cartModal) {
        closeCartBtn.addEventListener('click', () => {
            cartModal.style.right = '-400px';
        });
    }
});

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');

    if (cartCount) cartCount.innerText = cart.length;
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="color: #777; text-align: center;">Votre panier est vide.</p>';
        if (cartTotal) cartTotal.innerText = 'Total : 0 DA';
        return;
    }

    let html = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #f9f9f9; padding-bottom: 10px;">
                <div>
                    <strong>${item.name}</strong><br>
                    <small style="color: #666;">Taille: ${item.size} | ${item.price.toLocaleString()} DA</small>
                </div>
                <button style="background: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px;" onclick="removeFromCart(${item.cartId})">Supprimer</button>
            </div>
        `;
    });
    cartContainer.innerHTML = html;
    if (cartTotal) cartTotal.innerText = `Total : ${total.toLocaleString()} DA`;
}

function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    updateCartUI();
    updateCartCount();
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Votre panier est vide.");
        return;
    }
    let message = "Bonjour Kouim Luxury, je souhaite commander :\n";
    let total = 0;
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (Taille: ${item.size}) - ${item.price.toLocaleString()} DA\n`;
        total += item.price;
    });
    message += `\nTotal : ${total.toLocaleString()} DA`;
    
    const phone = "213541429664";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}
