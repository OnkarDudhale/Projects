const checkboxSwitch = document.getElementById('flexSwitchCheckDefault');

checkboxSwitch.addEventListener('click', () => {
    const taxes = document.getElementsByClassName('taxes');
    for (let tax of taxes) {
        tax.classList.toggle('hide');
    }
});


function scrollContentLeft(){
    const filters=document.querySelector('#filters');
        filters.scrollBy({ left: -100, behavior: 'smooth' });
}
function scrollContentRight(){
    const filters=document.querySelector('#filters');
    filters.scrollBy({ left: 100, behavior: 'smooth' });
}
