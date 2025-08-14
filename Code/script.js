// Add smooth scroll on button click (for "Explore Now" button)
document.querySelector('.hero button').addEventListener('click', function () {
    document.querySelector('#explore').scrollIntoView({
        behavior: 'smooth'
    });
});
