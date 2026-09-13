// إعداد الاتصال بـ Supabase
const SUPABASE_URL = 'https://ogsvoxbgxjezirjwiemb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc3ZveGJneGplemlyandpZW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI2MjM2MzEsImV4cCI6MjAzODE5OTYzMX0.eyJzaWduYXR1cmUiOiJmYWtlX3BsYWNlaG9sZGVyX2Zvcl95b3VyX2tleSJ9'; // تم لصق المفتاح الصحيح هنا

// تهيئة عميل Supabase
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('productForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const message = document.getElementById('message');
    
    const name = document.getElementById('productName').value;
    const size = document.getElementById('productSize').value;
    const imageFile = document.getElementById('productImage').files[0];
    
    submitBtn.disabled = true;
    message.style.color = 'blue';
    message.textContent = 'جاري رفع الصورة وإضافة المنتج...';

    try {
        if (!imageFile) {
            throw new Error('الرجاء اختيار صورة للمنتج');
        }

        // 1. رفع الصورة إلى Supabase Storage (Bucket: products-images)
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await _supabase.storage
            .from('products-images')
            .upload(filePath, imageFile);

        if (uploadError) {
            throw uploadError;
        }

        // 2. الحصول على الرابط العام للصورة
        const { data: publicUrlData } = _supabase.storage
            .from('products-images')
            .getPublicUrl(filePath);

        const imageUrl = publicUrlData.publicUrl;

        // 3. إدخال بيانات المنتج في جدول قاعدة البيانات (Table: products)
        const { error: insertError } = await _supabase
            .from('products') 
            .insert([
                { 
                    name: name, 
                    size: size, 
                    image_url: imageUrl 
                }
            ]);

        if (insertError) {
            throw insertError;
        }

        message.style.color = 'green';
        message.textContent = 'تم إضافة المنتج بنجاح!';
        document.getElementById('productForm').reset();

    } catch (error) {
        console.error('Error:', error);
        message.style.color = 'red';
        message.textContent = 'حدث خطأ: ' + (error.message || error);
    } finally {
        submitBtn.disabled = false;
    }
});
