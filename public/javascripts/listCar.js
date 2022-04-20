feather.replace(); //replaces feather icons


document.addEventListener('DOMContentLoaded',() => {
    //show alert if data from session storage exists
    if (sessionStorage.getItem('alert')) {
        const alert = JSON.parse(sessionStorage.getItem('alert'));
        sessionStorage.removeItem('alert');
        alert.type = alert.type || 'danger';
        alert.msg = alert.msg || 'Terjadi kesalahan';
        showAlert(alert.type, alert.msg);
    }
    getCarsData()
});
    

const showAlert = (type, msg) => {
    const alertElem = document.querySelector('#alert');
    alertElem.innerHTML = msg;
    alertElem.style.display = 'block';
    alertElem.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';

    //hide alert
    setTimeout(() => {
        alertElem.style.display = 'none';
    }, 3000);
}

const submitDelete = () => {
    const carId = document.querySelector('#delete-id').value;
    document.querySelector('#popup-submit').disabled = true;
    document.querySelector('#popup-submit').innerText = 'Loading...';
    document.querySelector('#popup-close').disabled = true;
    fetch(`/api/cars`, {
        method: 'DELETE',
        body: JSON.stringify({id: carId}),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        showAlert('danger', data.message || 'Data berhasil dihapus');
        closePopup();
        getCarsData();
    })
    .catch(err => console.log(err))
    .finally(() => {
        document.querySelector('#popup-submit').disabled = false;
        document.querySelector('#popup-submit').innerText = 'Ya';
        document.querySelector('#popup-close').disabled = true;
    })
}

const getCarsData = () => {
    fetch('/api/cars')
    .then(response => response.json())
    .then(data => {
        const formatRupiah=(angka)=> "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        
        const cars = data;
        const container = document.querySelector('#cars-container');
        container.innerHTML = '';
        cars.forEach(car => {
            const carElem = document.createElement('div');
            carElem.classList.add('car-card');
            carElem.innerHTML = `
                <div class="flex flex-col gap-3 text-sm">
                <img src="/storage/images/${ car.filename }" alt="Gambar mobil" class="" />
                <p>
                    ${ car.name }
                </p>
                <p class="font-bold">
                    ${ formatRupiah(car.price) } / hari
                </p>
                <div class="flex gap-1 items-center font light">
                    <i data-feather="clock" height="1rem" class="text-neutral-3"></i>
                    <span>Updated at ${ car.updatedAt.toLocaleString() }</span>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="showPopup(${ car.id })"
                    class="flex gap-1 justify-center items-center border border-danger py-2 font-bold text-danger rounded-sm">
                    <i data-feather="trash-2" height="1rem" stroke-width="3"></i>
                    <span>Delete</span>
                    </button>
                    <a href="/editCar/${ car.id }"
                    class="flex gap-1 justify-center items-center py-2 font-bold text-white bg-lime-4 rounded-sm">
                    <i data-feather="edit" height="1rem" stroke-width="3"></i>
                    <span>Edit</span>
                    </a>
                </div>
                </div>`
            container.appendChild(carElem);
        });
    })
    .catch(err => console.log(err))
}


const showPopup = (id) => {
    const popup = document.querySelector('#popup');
    popup.style.display = 'flex';
    document.querySelector('#delete-id').value = id;
}

const closePopup = () => {
    const popup = document.querySelector('#popup');
    popup.style.display = 'none';
}