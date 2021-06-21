document.addEventListener('DOMContentLoaded', (event) => {
    if (document.querySelector("#auth")) {
        document.querySelectorAll('.heart i').forEach(heart => {
            heart.onclick = like;
        })
        document.querySelector(".follow").onclick = follow;
    }
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

function follow() {
    let followers = document.querySelector(".followers_count");

    fetch(`follow/${this.id}`)
        .then(response => {
            return response.json();
        })
        .then(json => {
            followers.innerHTML = json;
        })

    if (this.classList[1]) {
        this.classList.remove("unfollow");
        this.innerHTML = '<i class="fas fa-user-plus"></i>Follow';
    } else {
        this.classList.add("unfollow");
        this.innerHTML = '<i class="fas fa-user-minus"></i>Unfollow';
    }
}