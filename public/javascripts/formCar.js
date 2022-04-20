feather.replace(); //replaces feather icons

document.querySelector('#upload-button').addEventListener('click', function() {
    document.querySelector('#file').click();
});

document.querySelector('#submit').addEventListener('click', function() {
    //submit to /api/cars with POST method
    const carId = document.querySelector('#car-id').value;
    const formData = new FormData();
    formData.append('name', document.querySelector('#name').value);
    formData.append('price', document.querySelector('#price').value);
    formData.append('size', document.querySelector('#size').value);
    formData.append('photo', document.querySelector('#file').files[0]);
    if (carId) formData.append('id', carId);

    //UI Loading
    document.querySelector('#submit').disabled = true;
    document.querySelector('#submit').innerText = 'Loading...';
    fetch('/api/cars', {
        method: carId ? 'PUT' : 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        sessionStorage.setItem('alert', JSON.stringify({type: 'success', msg: data.message}));
        window.location.href = '/'; //redirect to home page
    })
    .catch(err => console.log(err))
    .finally(() => {
        document.querySelector('#submit').disabled = false;
        document.querySelector('#submit').innerText = 'Submit';
    })
});