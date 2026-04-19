// Target Date: 23/04/2026, 12:00 PM (Trưa)
const targetDate = new Date("2026-04-23T12:00:00+07:00").getTime();

// Countdown Timer Logic
const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update the DOM
    document.getElementById("days").innerText = days.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

    // If the count down is finished, write some text
    if (distance < 0) {
        clearInterval(countdown);
        document.querySelector(".countdown-container").innerHTML = "<h2 style='color: var(--accent-color); font-size: 2rem;'>Sự kiện đã diễn ra! Cảm ơn mọi người! 🎉</h2>";
    }
}, 1000);

// Smooth scrolling for anchor links 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen & Music Enable
    const preloader = document.getElementById('preloader');
    const openBtn = document.getElementById('open-btn');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = musicToggle.querySelector('i');
    
    let isMusicPlaying = false;

    // Cố gắng phát nhạc sớm nhất có thể (khi vừa vào trang hoặc khi vừa chạm tay vào màng hình boot)
    const tryPlayMusic = () => {
        if (!isMusicPlaying) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicToggle.classList.add('playing');
            }).catch(err => {
                // Trình duyệt chặn autoplay cho đến khi người dùng tương tác
            });
        }
    };

    // Thử chạy ngay khi load web (Sẽ thành công trên Desktop, thất bại trên iOS)
    tryPlayMusic();
    
    // Nếu iOS chặn, chỉ cần họ vô tình chạm/vuốt màn hình đen là nhạc sẽ lên ngay trước khi bấm nút
    document.addEventListener('click', tryPlayMusic, { once: true });
    document.addEventListener('touchstart', tryPlayMusic, { once: true });

    openBtn.addEventListener('click', () => {
        // Đảm bảo iOS load nhạc khi có tương tác (nếu touchstart chưa kích hoạt)
        if (!isMusicPlaying) {
            bgMusic.load();
            tryPlayMusic();
        }
        
        // Hide preloader
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicIcon.className = 'bx bx-music';
            musicToggle.classList.remove('playing');
        } else {
            bgMusic.play();
            musicToggle.classList.add('playing');
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // 2. Intersection Observer (Lazy Smooth Scroll Reveal)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // 3. Pause music when tab is not focused/hidden
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            // Nếu tab bị ẩn, tạm dừng nhạc (nhưng vẫn nhớ trạng thái đang bật)
            if (!bgMusic.paused) {
                bgMusic.pause();
                musicToggle.classList.remove('playing');
            }
        } else {
            // Khi tab mở lại, nếu ban đầu người dùng đang bật nhạc thì phát tiếp
            if (isMusicPlaying) {
                bgMusic.play().then(() => {
                    musicToggle.classList.add('playing');
                }).catch(err => console.log("Resume failed", err));
            }
        }
    });
});

