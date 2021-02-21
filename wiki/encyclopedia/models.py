from django.db import models
from django import forms

class CreateNewEntry(forms.Form):
    title = forms.CharField(label='Title', max_length=100)
    content = forms.CharField(label='Description', widget=forms.Textarea(attrs={'rows': 12, 'cols': 30}))

# Create your models here.
