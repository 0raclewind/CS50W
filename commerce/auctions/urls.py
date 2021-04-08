from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("add_listing", views.add_listing, name="add_listing"),
    path("listing/<int:id>", views.listing_view, name="listing view"),
    path("listing/<int:listing_id>/watch", views.change_watch, name="change watch"),
    path("watched_listings", views.watched_listings, name="watched listings"),
    path("categorys", views.categorys, name="categorys")
]
