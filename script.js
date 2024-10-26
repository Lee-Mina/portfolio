document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".section");

    const options = {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("appear");
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        section.classList.add("fade-in"); // 초기 상태는 페이드 아웃
        appearOnScroll.observe(section);
    });
});
