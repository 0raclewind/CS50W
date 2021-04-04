from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Category(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name

class Listing(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    watchers = models.ManyToManyField(User, blank=True, related_name="watchers")
    time_created = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=40)
    description = models.TextField(max_length=400)
    starting_bid = models.FloatField()
    current_bid = models.FloatField(blank=True, null=True)
    image_url = models.CharField(max_length=200, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title} - {self.starting_bid}"

class Bid(models.Model):
    bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bidder")
    auction = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="auction")
    offer = models.FloatField()
    timestamp = models.DateTimeField(auto_now=True)