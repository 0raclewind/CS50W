document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.heart i').forEach(heart => {
        heart.onclick = like;
    })
})

function like() {
    fetch(`${this.id}/like`)

    if (this.className.split(" ")[0] === "far") {
        this.className = "fas fa-heart";
        this.classList.add("like-animation");
        this.addEventListener("animationend", () => {
            this.classList.remove("like-animation");
            this.style.color = "#ff3838";
        })
    } else {
        this.className = "far fa-heart";
        this.style.color = "#fff";
    }
}