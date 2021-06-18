document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.heart i').forEach(heart => {
        heart.onclick = like;
    })
})

function like() {
    let likes = this.parentElement.parentElement.querySelector(".likes");

    fetch(`${this.id}/like`)
        .then(response => {
            return response.json();
        })
        .then(json => {
            likes.innerHTML = json;
        })

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