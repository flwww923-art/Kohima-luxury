const SUPABASE_URL = 'https://ogsvoxbgxjezirjwiemb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc3ZveGJneGplemlyandpZW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMjkyNjMsImV4cCI6MjEwNDgwNTI2M30.vxMmDln8Kp9cLE4_tsfAhRaOMEQIU97e5X4z--IxoS8';

const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// جلب وعرض المنتجات في جدول المشرف فوراً
async function fetchAdminProducts() {
    const tbody = document.getElementById('admin-products-list');
    if (!tbody) return;

    try {
        const { data: products, error } = await _supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        tbody.innerHTML = '';
        if (!products || products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#777;">لا توجد منتجات حالياً.</td></tr>';
            return;
        }

        products.forEach(product => {
            const sizesText = product.size || product.sizes || '-';
            tbody.innerHTML += 
                '<tr>' +
                    '<td><img src="' + (product.image_url || '') + '" width="50" height="50" style="object-fit:cover; border-radius:4px;"></td>' +
                    '<td>' + product.name + '</td>' +
                    '<td>' + (product.price ? product.price.toLocaleString() + ' DA' : '') + '</td>' +
                    '<td>' + sizesText + '</td>' +
                    '<td><button class="delete-btn" onclick="deleteProduct(\'' + product.id + '\')">حذف</button></td>' +
                '</tr>';
        });
    } catch (err) {
        console.error('Error fetching admin products:', err);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">خطأ في جلب المنتجات.</td></tr>';
    }
}

// دالة حذف المنتج
async function deleteProduct(id) {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج؟')) return;

    try {
        const { error } = await _supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;

        alert('تم حذف المنتج بنجاح!');
        fetchAdminProducts();
    } catch (err) {
        console.error('Error deleting product:', err);
        alert('حدث خطأ أثناء الحذف: ' + err.message);
    }
}

// إضافة منتج جديد
document.addEventListener('DOMContentLoaded', () => {
    fetchAdminProducts();

    const form = document.getElementById('add-product-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.innerText = 'جاري الإضافة...';
            submitBtn.disabled = true;

            const name = document.getElementById('product-name').value;
            const price = parseFloat(document.getElementById('product-price').value);
            const size = document.getElementById('product-size').value;
            const imageFile = document.getElementById('product-image').files[0];

            try {
                let imageUrl = '';
                if (imageFile) {
                    const fileName = Date.now() + '-' + imageFile.name;
                    const { error: uploadError } = await _supabase.storage
                        .from('products-images')
                        .upload(fileName, imageFile);

                    if (uploadError) throw uploadError;

                    const { data: publicUrlData } = _supabase.storage
                        .from('products-images')
                        .getPublicUrl(fileName);

                    imageUrl = publicUrlData.publicUrl;
                }

                const { error: insertError } = await _supabase
                    .from('products')
                    .insert([{ name, price, size, image_url: imageUrl }]);

                if (insertError) throw insertError;

                alert('تمت إضافة المنتج بنجاح!');
                form.reset();
                fetchAdminProducts();
            } catch (err) {
                console.error('Error:', err);
                alert('حدث خطأ: ' + err.message);
            } finally {
                submitBtn.innerText = 'إضافة المنتج';
                submitBtn.disabled = false;
            }
        });
    }
});

// استدعاء الجلب مباشرة عند تحميل الملف
fetchAdminProducts();
