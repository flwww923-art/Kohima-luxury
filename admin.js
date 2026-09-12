const SUPABASE_URL = 'https://ogsvoxbgxjezirjwiemb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UAsbJ0EH5OPrd8M-VQz7Ow_R_QK4LQ-';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function loginAdmin() {
    const pass = document.getElementById('admin-password').value;
    if (pass === 'kouim3991') {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        loadAdminProducts();
    } else {
        alert('كلمة السر خاطئة!');
    }
}

function logoutAdmin() {
    location.reload();
}

async function loadAdminProducts() {
    const listContainer = document.getElementById('admin-products-list');
    listContainer.innerHTML = 'جاري التحميل...';

    const { data: products, error } = await supabaseClient.from('products').select('*');

    if (error) {
        listContainer.innerHTML = 'خطأ في جلب المنتجات.';
        return;
    }

    listContainer.innerHTML = '';
    if (!products || products.length === 0) {
        listContainer.innerHTML = '<p>لا توجد منتجات حالياً.</p>';
        return;
    }

    products.forEach(product => {
        listContainer.innerHTML += `
            <div class="admin-product-item">
                <img src="${product.image_url || 'images/product-1.jpg'}" alt="">
                <div style="flex-grow: 1;">
                    <strong>${product.name}</strong> - ${product.price} DA 
                    <br><small>المقاسات: ${product.sizes || 'غير متوفرة'}</small>
                </div>
                <button onclick="deleteProduct(${product.id})" style="background: red;">حذف</button>
            </div>
        `;
    });
}

async function addProduct(event) {
    event.preventDefault();
    const name = document.getElementById('p-name').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const image_url = document.getElementById('p-image').value;
    const sizes = document.getElementById('p-sizes').value;

    const { error } = await supabaseClient.from('products').insert([{ name, price, image_url, sizes }]);

    if (error) {
        alert('خطأ أثناء إضافة المنتج: ' + error.message);
    } else {
        alert('تمت إضافة المنتج بنجاح!');
        document.getElementById('add-product-form').reset();
        loadAdminProducts();
    }
}

async function deleteProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        const { error } = await supabaseClient.from('products').delete().eq('id', id);
        if (error) {
            alert('خطأ أثناء الحذف: ' + error.message);
        } else {
            loadAdminProducts();
        }
    }
}
