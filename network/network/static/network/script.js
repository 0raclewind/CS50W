document.addEventListener('DOMContentLoaded', (event) => {
    if (document.querySelector("#auth")) {
        document.querySelectorAll('.heart i').forEach(heart => {
            heart.onclick = like;
        })

        document.querySelectorAll(".edit").forEach(edit_btn => {
            edit_btn.onclick = edit;
        })

        // Follow button display
        if (document.querySelector(".follow")) {
            document.querySelector(".follow").onclick = follow;
        }
    }
})

function like() {
    let likes = this.parentElement.parentElement.querySelector(".likes");
    let post_id = this.parentElement.parentElement.parentElement.dataset.post_id;

    fetch(`${post_id}/like`)
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
    let profile_id = this.parentElement.parentElement.dataset.profile_id;

    fetch(`follow/${profile_id}`)
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

function edit() {
    const post = this.parentElement.parentElement;
    const post_id = post.dataset.post_id;
    let content = post.querySelector(".content");

    document.querySelector(".edit_field textarea").value = content.innerHTML;

    toggle_edit("show");

    document.querySelectorAll(".edit_field .cancel-btn, .backdrop").forEach(e => {
        e.addEventListener("click", () => {
            toggle_edit("hide");
        });
    });

    document.querySelector(".save-btn").addEventListener("click", () => {
        toggle_edit("hide");
        content.innerHTML = document.querySelector(".edit_field textarea").value;
    });
}

function toggle_edit(command) {
    if (command === "show") {
        document.querySelector(".backdrop").style.display = "block";
        document.querySelector(".edit_field").style.display = "block";
    } else {
        document.querySelector(".backdrop").style.display = "none";
        document.querySelector(".edit_field").style.display = "none";
    }
}