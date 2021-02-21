from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.shortcuts import reverse
from markdown2 import Markdown
from django import forms

import random

from . import util
from . import models


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

# List chosen entry
def list_entry(request, entry):
    markdowner = Markdown()
    
    try:
        content = markdowner.convert(util.get_entry(entry))
    except TypeError:
        content = None

    # Check if entry exists
    if content:
        return render(request, "encyclopedia/list_entry.html", {
            "entryContent": content,
            "title": entry
        })
    else:
        return render(request, "encyclopedia/entry_error.html", {
            "title": entry
        })

# Search in entries and redirect to entry if name matches
def search(request):
    value = request.GET.get('q')
    entry = util.get_entry(value)
    if entry:
        return HttpResponseRedirect(reverse("list_entry", kwargs={"entry": value}))
    else:
        entries = []
        
        for entry in util.list_entries():
            if value.lower() in entry.lower():
                entries.append(entry)

        return render(request, "encyclopedia/index.html", {
            "entries": entries,
            "search": True,
            "value": value
        })

# Create new entry
def create(request):
    if request.method == "POST":
        form = models.CreateNewEntry(request.POST)
        if form.is_valid():
            title = form.cleaned_data['title']
            content = form.cleaned_data['content']
            # Check for existing entries
            if util.get_entry(title) is None:
                util.save_entry(title, content)
                return HttpResponseRedirect(reverse('list_entry', kwargs={"entry": title}))
            else:
                return render(request, "encyclopedia/create_entry.html", {
                    "button_text": "Create entry",
                    "form": form,
                    "exists": True
                })
    else:
        return render(request, "encyclopedia/create_entry.html", {
            # Use different button text for Entry Creation
            "button_text": "Create entry",
            "form": models.CreateNewEntry()
        })

# Edit chosen entry
def edit(request, entry):
    if request.method == "POST":
        form = models.CreateNewEntry(request.POST)
        if form.is_valid():
            content = form.cleaned_data['content']
            util.save_entry(entry, content)
            return HttpResponseRedirect(reverse('list_entry', kwargs={"entry": entry}))
    else:
        form = models.CreateNewEntry()
        # Initialize and hide title field
        form.fields['title'].initial = entry
        form.fields['title'].widget = forms.HiddenInput()
        # Pre-populate content field
        form.fields["content"].initial = util.get_entry(entry)

        return render(request, "encyclopedia/create_entry.html", {
            # Use different button text for Entry Edit Save
            "button_text": "Save entry",
            "edit_title": entry,
            "form": form
        })

# Redirect to random page
def random_page(request):
    # Pick random page entry from entry list
    entry = random.choice(util.list_entries())
    return HttpResponseRedirect(reverse('list_entry', kwargs={"entry": entry}))