function toggleMenu() {
    const sidebar = document.getElementById('nav-sidebar');
    const overlay = document.querySelector('.nav-overlay');
    sidebar.classList.toggle('open');
    overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
}
