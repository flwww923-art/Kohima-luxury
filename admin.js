// إعداد الاتصال بـ Supabase باستخدام البيانات الصحيحة من مشروعك
const SUPABASE_URL = 'https://ogsvoxbgxjezirjwiemb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UAsbJ0EH50Prd8M-VQz70w_R_Qk4LQ-'; 

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

        // 1. رفع الصورة إلى Supabase Storage (تأكد أن اسم الـ Bucket لديك هو products أو قم بتعديله بالأسفل)
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await _supabase.storage
            .from('products') // اسم الـ Bucket في Supabase (تأكد أنه مطابق عندك)
            .upload(filePath, imageFile);

        if (uploadError) {
            throw uploadError;
        }

        // 2. الحصول على الرابط العام للصورة
        const { data: publicUrlData } = _supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        const imageUrl = publicUrlData.publicUrl;

        // 3. إدخال بيانات المنتج في جدول قاعدة البيانات (تأكد أن اسم الجدول لديك هو products)
        const { error: insertError } = await _supabase
            .from('products') // اسم جدول المنتجات في قاعدة البيانات
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
