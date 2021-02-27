from django.contrib.auth.models import AbstractUser
from django.db import models


# category_choice = [
#     ("fashion", "Fashion"),
#     ("electronics", "Electronics"),
#     ("home", "Home")
# ]

class User(AbstractUser):
    pass

"""
Create Listing: Users should be able to visit a page to create a new listing. They should be able to specify a title for the listing, a text-based description, and what the starting bid should be. Users should also optionally be able to provide a URL for an image for the listing and/or a category (e.g. Fashion, Toys, Electronics, Home, etc.).
"""
class Listing(models.Model):
    title = models.CharField(max_length=40)
    description = models.TextField(max_length=400)
    starting_bid = models.DecimalField(max_digits=5, decimal_places=2)
    image_url = models.URLField()
    # category = models.ChoiceField(choices=category_choice)