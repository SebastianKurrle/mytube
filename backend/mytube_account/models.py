from django.db import models
from users.models import User
from uuid import uuid4


# Account a user can create to upload videos
class MyTubeAccount(models.Model):
    id = models.CharField(primary_key=True, default=uuid4(), editable=False, max_length=255)
    name = models.CharField(max_length=255)
    description = models.TextField()
    profile_picture = models.ImageField(upload_to='prof_pictures/', default='prof_pictures/default.png')
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def get_image(self):
        return 'http://127.0.0.1:8000' + self.profile_picture.url
