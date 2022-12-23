const loading = document.querySelector('.loading');
const createBtn = document.querySelector('#createCampBtn');
const deleteBtn = document.querySelector('#deleteCampBtn');
const updateBtn = document.querySelector('#updateCampBtn');

if (createBtn) {
    createBtn.addEventListener('click', () => {
    showLoading();
})
}
if (updateBtn) {
    updateBtn.addEventListener('click', () => {
        showLoading();
    })
}
if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
        showLoading();
    })
}

function showLoading() {
        loading.classList.add('show');
        // load more data
        setTimeout(getCampground, 1000)
        // loading.classList.remove('show');
}
