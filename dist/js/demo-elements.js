document.addEventListener('DOMContentLoaded', function () {
    fetch('./dist/html/footer.html')
        .then(response => response.text())
        .then(data => document.getElementById('footer-placeholder').innerHTML = data);
});
