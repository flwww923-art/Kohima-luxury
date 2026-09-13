const SUPABASE_URL = 'https://ogsvoxbgxjezirjwiemb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nc3ZveGJneGplemlyandpZW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMjkyNjMsImV4cCI6MjEwNDgwNTI2M30.vxMmDln8Kp9cLE4_tsfAhRaOMEQIU97e5X4z--IxoS8'; 

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('productForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const message = document.getElementById('message');
    
    const name = document.getElementById('productName').value;
    const priceField = document.getElementById('productPrice').value;
    const price = priceField ? parseFloat(priceField) : 0;
    const size = document.getElementById('productSize').value;
    const imageFile = document.getElementById('productImage').files[0];
    
    submitBtn.disabled = true;
    message.style.color = 'blue';
    message.textContent = 'جاري رفع الصورة وإضافة المنتج...';

    try {
        if (!imageFile) {
            throw new Error('الرجاء اختيار صورة للمنتج');
        }

        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await _supabase.storage
            .from('products-images')
            .upload(filePath, imageFile);

        if (uploadError) {
            throw uploadError;
        }

        const { data: publicUrlData } = _supabase.storage
            .from('products-images')
            .getPublicUrl(filePath);

        const imageUrl = publicUrlData.publicUrl;

        // إرسال البيانات متضمنة السعر بشكل إجباري
        const { error: insertError } = await _supabase
            .from('products') 
            .insert([
                { 
                    name: name, 
                    price: price,
                    description: 'المقاسات: ' + size, 
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
