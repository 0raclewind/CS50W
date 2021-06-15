from django import forms

from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = [
            'post_content'
        ]

        labels = {
            "post_content": ""
        }

        widgets = {
            "post_content": forms.Textarea(attrs={
                "class": "postArea",
                "placeholder": "Enter your post",
                "rows": "3"
            })
        }