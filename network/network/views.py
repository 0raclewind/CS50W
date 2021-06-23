from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import User, Post, Profile
from .forms import PostForm

import json


def index(request):
    if request.method =="POST":
        form = PostForm(request.POST)
        if form.is_valid():
            newForm = form.save(commit=False)
            newForm.user = request.user
            newForm.save()
            return HttpResponseRedirect(reverse('index'))

    posts = Post.objects.all().order_by("-time_created")
    return render(request, "network/index.html", {
        "postForm": PostForm(),
        "posts": paginator(request, posts)
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
        "posts": paginator(request, posts)
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
    posts = Post.objects.filter(user__profile__in=following).all().order_by("-time_created")
    return render(request, "network/following.html", {
        "posts": paginator(request, posts)
    })

@login_required
def edit_post(request):
    data = json.loads(request.body)
    post = Post.objects.get(pk=data["post_id"])
    if post.user != request.user:
        return HttpResponse(status=401)
    post.post_content = data["content"]
    post.save()
    return HttpResponse(200)

def paginator(request, posts):
    page = request.GET.get('page', 1)

    paginator = Paginator(posts, 10)
    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(1)
    except EmptyPage:
        posts = paginator.page(paginator.num_pages)

    return posts