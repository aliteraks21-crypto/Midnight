(function () {
    var lqScene = document.createElement('div');
    lqScene.id = 'bg-scene';
    lqScene.setAttribute('aria-hidden', 'true');
    lqScene.innerHTML =
        '<div id="bg-img"></div>' +
        '<div id="bg-liquid"><img src="backg.jpg" alt="" aria-hidden="true"></div>' +
        '<div id="bg-glass"></div>';
    document.body.prepend(lqScene);

    var lqSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    lqSvg.setAttribute('aria-hidden', 'true');
    lqSvg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
    lqSvg.innerHTML =
        '<defs>' +
        '<filter id="liquid-distort" x="-10%" y="-10%" width="120%" height="120%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="3" seed="4" result="turb">' +
        '<animate attributeName="baseFrequency" values="0.012 0.018;0.016 0.024;0.012 0.018" dur="14s" repeatCount="indefinite"/>' +
        '</feTurbulence>' +
        '<feDisplacementMap in="SourceGraphic" in2="turb" scale="30" xChannelSelector="R" yChannelSelector="G"/>' +
        '</filter>' +
        '</defs>';
    document.body.appendChild(lqSvg);

    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.prepend(progressBar);
    window.addEventListener('scroll', function () {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = scrollable > 0 ? (window.scrollY / scrollable * 100) + '%' : '0%';
    }, { passive: true });

    const hamburger = document.getElementById('hamburger');
    const navPill = document.getElementById('navPill');
    if (hamburger && navPill) {
        const setOpen = function (open) {
            hamburger.classList.toggle('open', open);
            navPill.classList.toggle('open', open);
            hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
        };

        hamburger.addEventListener('click', function () {
            setOpen(!navPill.classList.contains('open'));
        });

        navPill.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                setOpen(false);
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navPill.classList.contains('open')) {
                setOpen(false);
                hamburger.focus();
            }
        });
    }

    const navbar = document.getElementById('navbar');
    if (navbar) {
        const onScroll = function () {
            navbar.classList.toggle('scrolled', window.scrollY > 12);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    var revealAll = function () {
        document.querySelectorAll('.reveal').forEach(function (el) {
            el.classList.add('show');
        });
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('show');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.05 });
        document.querySelectorAll('.reveal').forEach(function (el) {
            io.observe(el);
        });
        setTimeout(revealAll, 2000);
    } else {
        revealAll();
    }
})();

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg || 'انجام شد ✅';
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () { toast.classList.remove('show'); }, 2600);
}

function copyIP(ip) {
    const value = ip || 'mtasa://play.midnightrp.ir:22003';
    const done = function () { showToast('آی‌پی کپی شد ✅'); };
    function fallback() {
        const t = document.createElement('textarea');
        t.value = value;
        t.style.position = 'fixed';
        t.style.opacity = '0';
        document.body.appendChild(t);
        t.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(t);
        done();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(fallback);
    } else {
        fallback();
    }
}
