// Hàm kiểm tra và áp dụng chế độ tối ngay lập tức để tránh bị nháy trang
(function initTheme() {
    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark-theme');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Khởi tạo hiệu ứng AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }

    // 1.1 Hiệu ứng cuộn: thanh tiến trình + nút lên đầu trang
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Lên đầu trang');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);

    const updateScrollEffects = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        scrollProgress.style.width = `${progress}%`;
        backToTopBtn.classList.toggle('show', scrollTop > 280);
    };

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', updateScrollEffects, {
        passive: true
    });
    updateScrollEffects();

    // 1.2 Làm mượt thao tác lăn chuột lên/xuống (desktop)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
        let targetScrollY = window.scrollY;
        let currentScrollY = window.scrollY;
        let isSmoothScrolling = false;

        const animateSmoothScroll = () => {
            const delta = targetScrollY - currentScrollY;
            currentScrollY += delta * 0.12;

            if (Math.abs(delta) < 0.5) {
                currentScrollY = targetScrollY;
                isSmoothScrolling = false;
            } else {
                requestAnimationFrame(animateSmoothScroll);
            }

            window.scrollTo(0, currentScrollY);
        };

        window.addEventListener('wheel', (event) => {
            if (event.ctrlKey) return;

            event.preventDefault();
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            targetScrollY = Math.max(0, Math.min(maxScroll, targetScrollY + event.deltaY));

            if (!isSmoothScrolling) {
                isSmoothScrolling = true;
                requestAnimationFrame(animateSmoothScroll);
            }
        }, {
            passive: false
        });
    }

    // 2. Xử lý Dark Mode
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const body = document.body;

    if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');

        // Cập nhật icon đúng theo trạng thái hiện tại
        if (body.classList.contains('dark-theme')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        }

        toggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-theme');

            if (body.classList.contains('dark-theme')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('dark-mode', 'enabled');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('dark-mode', 'disabled');
            }
        });
    }

    // 3. Xử lý active link trên navbar
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});
