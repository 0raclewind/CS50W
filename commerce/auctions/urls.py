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
    path("categories", views.categories, name="categories"),
    path("categories/<int:cat_id>", views.category_view, name="category view"),
    path("leave_comment/<int:id>", views.leave_comment, name="leave comment"),
    path("close_auction/<int:id>", views.close_auction, name="close auction"),
    path("your_auctions", views.your_auctions, name="your auctions"),
    path("won", views.auctions_won, name="won")
]
