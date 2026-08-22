const aiButton = document.getElementById("demoAI");

aiButton.addEventListener("click", () => {
    aiButton.textContent = "AI Safety Analysis Active ✓";

    setTimeout(() => {
        aiButton.textContent = "Try AI Safety Demo";
    }, 2500);
});


const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    },
    {
        threshold: 0.15
    }
);


document
    .querySelectorAll(".feature-card, .audience-card, .ai-card")
    .forEach((element) => {
        observer.observe(element);
    });
