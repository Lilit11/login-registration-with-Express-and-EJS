document.getElementById("uploader").addEventListener('click', (e) => {
    e.preventDefault()
    
    const file = document.getElementById('file').files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const base64File = reader.result.split(',')[1];

        fetch('/uploads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ file: base64File, fileName: file.name }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                alert('File uploaded successfully ');
            })
            .catch((err) => console.log(err));
    };
    reader.readAsDataURL(file);
})
