from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required


from .models import User, Listing, Bid
from .forms import ListingForm, BidForm


def index(request):
    listings = Listing.objects.all()
    return render(request, "auctions/index.html", {
        "listings": listings
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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

@login_required
def add_listing(request):
    if request.method =="POST":
        form = ListingForm(request.POST)
        if form.is_valid():
            newForm = form.save(commit=False)
            newForm.user = request.user
            newForm.current_bid = newForm.starting_bid
            newForm.save()
            return HttpResponseRedirect(reverse('index'))
    return render(request, 'auctions/add_listing.html', {
        "form": ListingForm()
    })

def listing_view(request, id):
    listing = Listing.objects.get(pk=id)
    if request.method == "POST":
        form = BidForm(request.POST)
        if form.is_valid():
            newForm = form.save(commit=False)
            if newForm.offer > listing.current_bid:
                listing.current_bid = newForm.offer
                newForm.bidder = request.user
                newForm.auction = listing
                listing.save()
                newForm.save()
            else:
                return render(request, "auctions/view_listing.html", {
                    "listing": listing,
                    "bidForm": BidForm(request.POST),
                    "tooLow": True
                })
    if request.user == listing.user:
        bids = Bid.objects.filter(auction=id).order_by("-timestamp")
        return render(request, "auctions/view_listing.html", {
            "listing": listing,
            "listingOwner": True,
            "bids": bids
        })
    else:
        return render(request, "auctions/view_listing.html", {
            "listing": listing,
            "bidForm": BidForm()
        })

