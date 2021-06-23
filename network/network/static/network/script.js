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

    fetch(`/${post_id}/like`)
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
    const post = this.parentElement.parentElement.parentElement;
    const post_id = post.dataset.post_id;
    let content = post.querySelector(".content");
    const content_value = content.innerHTML;
    const cancel_btn = post.querySelector(".cancel-btn");
    const save_btn = post.querySelector(".save-btn");
    const edit_btn = post.querySelector(".edit");

    cancel_btn.style.display = 'block';
    save_btn.style.display = 'block';
    edit_btn.style.display = 'none';

    content.innerHTML = "<textarea cols=38 rows=1>";
    content.querySelector("textarea").value = content_value;


    post.querySelector(".save-btn").addEventListener("click", () => {
        let new_content = content.querySelector("textarea").value;
        if (content_value != new_content) {
            fetch("edit", {
                method: "PUT",
                headers: {
                    'X-CSRFToken': getCookie("csrftoken")
                },
                body: body = JSON.stringify({
                    "post_id": post_id,
                    "content": new_content
                })
            });
            exit_edit(post, new_content);
        } else {
            exit_edit(post, content_value);
        }
    });

    document.querySelector(".cancel-btn").addEventListener("click", () => {
        exit_edit(post, content_value);
    });
}

function exit_edit(post, content) {
    post.querySelector(".content").innerHTML = content;

    post.querySelector(".save-btn").style.display = "none";
    post.querySelector(".cancel-btn").style.display = "none";
    post.querySelector(".edit").style.display = "flex";
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}