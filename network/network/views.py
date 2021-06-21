from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required

from .models import User, Post, Profile
from .forms import PostForm


def index(request):
    if request.method =="POST":
        form = PostForm(request.POST)
        if form.is_valid():
            newForm = form.save(commit=False)
            newForm.user = request.user
            newForm.save()
            return HttpResponseRedirect(reverse('index'))

    return render(request, "network/index.html", {
        "postForm": PostForm(),
        "posts": Post.objects.all().order_by("-time_created")
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            Profile(user=user).save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def update_like(request, post_id):
    post = Post.objects.get(pk=post_id)
    
    try:
        # Check if user likes the post
        post.likes.get(username=request.user)
        post.likes.remove(request.user)
    except:
        post.likes.add(request.user)

    # Return total post likes count
    return HttpResponse(post.likes.count())

def profile(request, profile_id):
    profile = Profile.objects.get(user=profile_id)
    posts = Post.objects.filter(user_id=profile_id).order_by("-time_created")

    return render(request, "network/profile.html", {
        "profile": profile,
        "posts": posts
    })

@login_required
def follow(request, profile_id):
    profile = Profile.objects.get(user=profile_id)

    try:
        profile.followers.get(username=request.user)
        profile.followers.remove(request.user)
    except:
        profile.followers.add(request.user)

    # Return followers count
    return HttpResponse(profile.followers.count())

@login_required
def following_page(request):
    following = request.user.following.all()
    print(following)
    posts = Post.objects.filter(user__profile__in=following).all()
    return render(request, "network/following.html", {
        "posts": posts.order_by("-time_created")
    })