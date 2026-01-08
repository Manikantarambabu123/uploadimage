document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.querySelector('input[type="file"][name="image"]');
    const previewImg = document.getElementById('image-preview');
    const noImageText = document.getElementById('no-image-text');

    if (imageInput && previewImg) {
        imageInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImg.src = e.target.result;
                    previewImg.style.display = 'block';
                    if (noImageText) {
                        noImageText.style.display = 'none';
                    }
                }
                reader.readAsDataURL(file);
            }
        });
    }
});
