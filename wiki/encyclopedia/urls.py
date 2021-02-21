from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:entry>", views.list_entry, name="list_entry"),
    path("search", views.search, name="search"),
    path("create", views.create, name="create"),
    path("wiki/<str:entry>/edit", views.edit, name="edit"),
    path("random", views.random_page, name="random")
]
