from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    time_created = models.DateTimeField(auto_now=True)
    post_content = models.TextField(max_length=400)
    likes = models.ManyToManyField(User, related_name="likes")

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    followers = models.ManyToManyField(User, related_name="followers")
    following = models.ManyToManyField(User, related_name="following")