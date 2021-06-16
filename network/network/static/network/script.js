document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.heart i').forEach(heart => {
        heart.onclick = like;
    })
})

function like() {
    if (this.className.split(" ")[0] === "far") {
        this.className = "fas fa-heart";
    } else {
        this.className = "far fa-heart";
    }
}