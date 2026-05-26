// ==========================================
// 广东中瑞制罐有限公司 - 官方网站交互脚本
// ==========================================

document.addEventListener('DOMContentLoaded', function() {

    // ===== LANGUAGE SWITCHER =====
    const langOptions = document.querySelectorAll('.lang-option');
    let currentLang = localStorage.getItem('zhongrui_lang') || 'zh';
    
    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('zhongrui_lang', lang);
        const dict = lang === 'zh' ? zh_translations : en_translations;
        
        // Update elements with data-lang-key
        document.querySelectorAll('[data-lang-key]').forEach(function(el) {
            const key = el.getAttribute('data-lang-key');
            if (dict[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = dict[key];
                } else if (el.tagName === 'IMG') {
                    el.alt = dict[key];
                } else {
                    el.innerHTML = dict[key];
                }
            }
        });
        
        // Update html lang attribute
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
        
        // Update page title
        const titleMap = {
            'zh': '广东中瑞制罐有限公司 - 专注制罐27年 | 纸罐·纸筒·复合罐定制',
            'en': 'Guangdong Zhongrui Can Making Co., Ltd. - 25 Years of Can Making Excellence'
        };
        document.title = titleMap[lang] || titleMap.zh;
        
        // Update lang switcher active state
        langOptions.forEach(function(opt) {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
        });
    }
    
    langOptions.forEach(function(opt) {
        opt.addEventListener('click', function() {
            applyLanguage(this.getAttribute('data-lang'));
        });
    });
    
    // Apply saved language on load
    applyLanguage(currentLang);
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('open');
        });
        // Close nav on link click
        nav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                nav.classList.remove('open');
            });
        });
    }

    // ===== STICKY HEADER SHADOW =====
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ===== HERO SLIDER =====
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-controls .dot');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        slides.forEach(function(s) { s.classList.remove('active'); });
        dots.forEach(function(d) { d.classList.remove('active'); });
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    // Dot clicks
    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            var idx = parseInt(this.getAttribute('data-slide'));
            goToSlide(idx);
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
    });

    // Auto play
    if (slides.length > 0) {
        slideInterval = setInterval(nextSlide, 5000);
    }

    // ===== COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;
        statNumbers.forEach(function(el) {
            const target = parseInt(el.getAttribute('data-target'));
            if (isNaN(target)) return;
            
            let current = 0;
            const increment = Math.ceil(target / 60);
            const timer = setInterval(function() {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                // Format large numbers
                if (target >= 1000) {
                    el.textContent = current.toLocaleString();
                } else {
                    el.textContent = current;
                }
            }, 25);
        });
    }

    // Trigger counters when stats section comes into view
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    startCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(statsSection);
    }

    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== FORM SUBMIT =====
    const form = document.getElementById('inquiryForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Allow the form to submit to backend normally
            // If backend is not available, show fallback message
            var submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = '提交中...';
            
            // Fallback after 8 seconds if no response
            setTimeout(function() {
                if (submitBtn.disabled) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = '提交询价';
                    alert('感谢您的询价！如未收到确认，请直接拨打：0757-26329881');
                }
            }, 8000);
        });
    }

    // ===== SCROLL ANIMATIONS =====
    const animateItems = document.querySelectorAll('.product-card, .gallery-item, .factory-item, .news-card, .adv-item, .case-step');
    const animObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                animObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animateItems.forEach(function(item) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        animObserver.observe(item);
    });

    // ===== SUB-PAGE NAVIGATION =====
    const subLinks = document.querySelectorAll('.sub-link');
    subLinks.forEach(function(link) {
        // Skip factory sub-links - they have their own handler
        if (link.classList.contains('factory-sub-link')) return;
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Hide main about section
                const aboutSection = document.getElementById('about');
                if (aboutSection) aboutSection.style.display = 'none';
                // Show sub-page
                targetSection.style.display = 'block';
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Back to about main
    document.querySelectorAll('.read-more[href="#about"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const aboutSection = document.getElementById('about');
            if (aboutSection) aboutSection.style.display = '';
            document.querySelectorAll('[id^="about-"]').forEach(function(sub) {
                if (sub.id !== 'about') sub.style.display = 'none';
            });
        });
    });

    // ===== FACTORY SUB-PAGE NAVIGATION =====
    document.querySelectorAll('.factory-sub-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const factorySection = document.getElementById('factory');
            const capacitySection = document.getElementById('factory-capacity');
            if (targetId === '#factory') {
                if (factorySection) factorySection.style.display = '';
                if (capacitySection) capacitySection.style.display = 'none';
                factorySection.scrollIntoView({ behavior: 'smooth' });
            } else if (targetId === '#factory-capacity') {
                if (factorySection) factorySection.style.display = 'none';
                if (capacitySection) capacitySection.style.display = '';
                capacitySection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Back to factory main
    document.querySelectorAll('.factory-back-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const factorySection = document.getElementById('factory');
            const capacitySection = document.getElementById('factory-capacity');
            if (factorySection) factorySection.style.display = '';
            if (capacitySection) capacitySection.style.display = 'none';
            factorySection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ===== NEWS MODAL =====
    const newsData = [
        {
            date: '2026-03-15',
            titleKey: 'news.title1',
            bodyKeys: ['news.full1_p1', 'news.full1_p2', 'news.full1_p3']
        },
        {
            date: '2026-01-20',
            titleKey: 'news.title2',
            bodyKeys: ['news.full2_p1', 'news.full2_p2', 'news.full2_p3']
        },
        {
            date: '2025-12-08',
            titleKey: 'news.title3',
            bodyKeys: ['news.full3_p1', 'news.full3_p2', 'news.full3_p3']
        }
    ];

    window.openNewsModal = function(index) {
        const data = newsData[index];
        var modalDate = document.getElementById('newsModalDate');
        var modalTitle = document.getElementById('newsModalTitle');
        var modalBody = document.getElementById('newsModalBody');
        if (!modalDate || !modalTitle || !modalBody) return;

        modalDate.textContent = data.date;
        modalTitle.setAttribute('data-lang-key', data.titleKey);
        modalBody.innerHTML = data.bodyKeys.map(function(k) {
            return '<p data-lang-key="' + k + '"></p>';
        }).join('');

        applyLanguage(currentLang);
        document.getElementById('newsModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    window.closeNewsModal = function() {
        document.getElementById('newsModal').style.display = 'none';
        document.body.style.overflow = '';
    };

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeNewsModal();
    });
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(function(section) {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

});
