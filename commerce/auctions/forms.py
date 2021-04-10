from django import forms

from .models import Listing, Bid, Comments

class ListingForm(forms.ModelForm):
    class Meta:
        model = Listing
        fields = [
            'title',
            'description',
            'starting_bid',
            'image_url',
            'category'
        ]

class BidForm(forms.ModelForm):
    class Meta:
        model = Bid
        fields = [
            'offer'
        ]

        widgets = {
            "offer": forms.NumberInput(attrs={
                'class': 'bidInput',
                'placeholder': 'Your bid'
            })
        }

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comments
        fields = [
            "comment"
        ]

        labels = {
            "comment": ""
        }

        widgets = {
            "comment": forms.Textarea(attrs={
                "class": "commentArea",
                "placeholder": "Enter your comment",
                "rows": "3"
            })
        }