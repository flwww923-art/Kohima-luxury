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
            let rawSizes = product.size || product.sizes || '37, 38, 39, 40, 41, 42';
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

                        <button class="add-cart" style="width: 100%; background: #000; color: #fff; border: none; padding: 12px; border-radius: 6px; cursor: pointer; margin-top: 10px; font-weight: bold;" onclick="buyDirect('${product.name}', ${product.price || 0}, '${product.id}')">
                            Commander / Acheter
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

// دالة الشراء المباشر وإرسال الطلب للواتساب فوراً
function buyDirect(name, price, productId) {
    const chosenSize = window.selectedSizes[productId];
    if (!chosenSize) {
        alert("Veuillez choisir une taille d'abord ! (الرجاء اختيار المقاس أولاً)");
        return;
    }

    let message = `Bonjour Kouim Luxury, je souhaite commander ce produit :\n\n`;
    message += `▪️ Produit : ${name}\n`;
    message += `▪️ Taille : ${chosenSize}\n`;
    message += `▪️ Prix : ${price.toLocaleString()} DA\n`;

    // تم تحديث الرقم الجديد هنا
    const phone = "213659246214"; 

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
