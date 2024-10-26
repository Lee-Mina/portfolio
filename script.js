document.addEventListener("DOMContentLoaded", function () {
    const faders = document.querySelectorAll(".fade-in");

    const appearOptions = {
        threshold: 0.5,  // 50%가 뷰포트에 보일 때 애니메이션 실행
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});
