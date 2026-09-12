// =====================================================
// KOUIM LUXURY — SCRIPT
// =====================================================

const SUPABASE_URL = 'https://ogsvoxbgxjezirjwiemb.supabase.co';
const SUPABASE_ANON_KEY = sb_publishable_UAsbJ0EH5OPrd8M-VQz7Ow_R_QK4L

// تهيئة عميل Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let cart = [];

// جلب المنتجات من جدول Supabase وعرضها في الموقع
async function loadProducts() {
    const container = document.getElementById('products-container');
    
    const { data: products, error } = await supabaseClient
        .from('products')
        .select('*');

    if (error) {
        console.error('خطأ في جلب المنتجات:', error);
        return;
    }

    container.innerHTML = '';

    if (!products || products.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">لا توجد منتجات مضافة حالياً.</p>';
        return;
    }

    products.forEach(product => {
        const productHTML = `
            <article class="product-card">
                <div class="product-image">
                    <img src="${product.image_url || 'images/product-1.jpg'}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <p class="product-category">${product.category || 'KOUIM LUXURY'}</p>
                    <h3>${product.name}</h3>
                    <p class="product-price">${product.price} DA</p>
                    <button class="add-cart" onclick='addToCart(${JSON.stringify(product)})'>
                        Ajouter au panier
                    </button>
                </div>
            </article>
        `;
        container.innerHTML += productHTML;
    });
}

function addToCart(product) {
    cart.push(product);
    
    const cartCounter = document.getElementById("cart-count");
    if (cartCounter) {
        cartCounter.textContent = cart.length;
    }

    alert(`تم إضافة "${product.name}" إلى السلة بنجاح!`);
}

document.addEventListener('DOMContentLoaded', loadProducts);
