// تحميل مكتبة Supabase تلقائياً داخل الكود لتجنب أي تعديل في HTML
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

        // جلب المنتجات مرتبة تنازلياً حسب معرف المنتج
        const { data: products, error } = await _supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        if (!products || products.length === 0) {
            return; 
        }

        // تفريغ الحاوية وإضافة المنتجات الحقيقية
        container.innerHTML = '';

        products.forEach(product => {
            const productHTML = `
                <article class="product-card">
                    <div class="product-image">
                        <img src="${product.image_url || 'images/product-1.jpg'}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <p class="product-category">KOUIM LUXURY</p>
                        <h3>${product.name}</h3>
                        <p class="product-price">${product.price ? product.price.toLocaleString() + ' DA' : ''}</p>
                        <p style="font-size: 13px; color: #666; margin-bottom: 10px;">${product.description || ''}</p>
                        <button class="add-cart" onclick="alert('تمت إضافة المنتج إلى السلة')">
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

// تشغيل الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadProducts);
