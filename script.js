document.addEventListener('scroll', function() {
    const projects = document.querySelectorAll('.project');
    const triggerPoint = window.innerHeight / 1.3;

    projects.forEach(project => {
        const projectTop = project.getBoundingClientRect().top;

        if (projectTop < triggerPoint) {
            project.classList.add('visible');
        }
    });
});
