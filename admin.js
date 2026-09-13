const SUPABASE_URL = 'https://ogsvoxbgxjezirjwiemb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc3ZveGJneGplemlyandpZW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxNzUwMDAsImV4cCI6MjA0MTc1NTAwMH0.fake_key_placeholder';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function loginAdmin() {
    const pass = document.getElementById('admin-password').value
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
        listContainer.innerHTML = 'خطأ في جلب المنتجات: ' + error.message;
        return;
    }

    listContainer.innerHTML = '';
    if (!products || products.length === 0) {
        listContainer.innerHTML = '<p>لا توجد منتجات حالياً.</p>';
        return;
    }

    products.forEach(product => {
        listContainer.innerHTML += `
            <div class="admin-product-item" style="display:flex; align-items:center; gap:10px; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:5px;">
                <img src="${product.image_url || ''}" alt="" style="width:50px; height:50px; object-fit:cover;">
                <div style="flex-grow: 1;">
                    <strong>${product.name}</strong> - ${product.price} DA 
                    <br><small>المقاسات: ${product.sizes || 'غير متوفرة'}</small>
                </div>
                <button onclick="deleteProduct(${product.id})" style="background: red; color: white; border: none; padding: 5px 10px; cursor: pointer;">حذف</button>
            </div>
        `;
    });
}

async function addProduct(event) {
    event.preventDefault();
    const name = document.getElementById('p-name').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const sizes = document.getElementById('p-sizes').value;
    const fileInput = document.getElementById('p-image-file');
    
    if (!fileInput || fileInput.files.length === 0) {
        alert('الرجاء اختيار صورة للمنتج!');
        return;
    }

    const file = fileInput.files[0];
    const fileName = `${Date.now()}_${file.name}`;

    const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from('products-images')
        .upload(fileName, file);

    if (uploadError) {
        alert('خطأ أثناء رفع الصورة: ' + uploadError.message);
        return;
    }

    const { data: urlData } = supabaseClient.storage
        .from('products-images')
        .getPublicUrl(fileName);

    const image_url = urlData.publicUrl;

    const { error } = await supabaseClient.from('products').insert([{ 
        name, 
        price, 
        image_url, 
        sizes, 
        description: '', 
        stock: 10, 
        category: 'Shoes' 
    }]);

    if (error) {
        alert('خطأ أثناء إضافة المنتج في القاعدة: ' + error.message);
    } else {
        alert('تمت إضافة المنتج والصورة بنجاح!');
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
