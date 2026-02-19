document.addEventListener("DOMContentLoaded", () => {

    const nameTitle = document.querySelector("h1");
    const originalColor = "#5C4033";
    const clickedColor = "#9C6B30";

    let isClicked = false;

    nameTitle.addEventListener("click", () => {
        if (!isClicked) {
            nameTitle.style.color = clickedColor;
        } else {
            nameTitle.style.color = originalColor;
        }
        isClicked = !isClicked;
    });

    const artwork = document.querySelector("img");

    artwork.addEventListener("mouseenter", () => {
        artwork.style.transform = "scale(1.03)";
        artwork.style.transition = "transform 0.3s ease";
    });

    artwork.addEventListener("mouseleave", () => {
        artwork.style.transform = "scale(1)";
    });

    const skills = document.querySelectorAll("li");

    skills.forEach(skill => {
        skill.addEventListener("mouseenter", () => {
            skill.style.transform = "scale(1.08)";
            skill.style.transition = "transform 0.25s ease";
        });

        skill.addEventListener("mouseleave", () => {
            skill.style.transform = "scale(1)";
        });
    });

});