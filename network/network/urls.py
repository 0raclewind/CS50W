
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("<int:post_id>/like", views.update_like, name="like"),
    path("profile/<int:profile_id>", views.profile, name="profile"),
    path("profile/follow/<int:profile_id>", views.follow, name="follow"),
    path("following", views.following_page, name="following")
]
