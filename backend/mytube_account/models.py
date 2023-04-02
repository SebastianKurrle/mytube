from django.db import models
from users.models import User


# Account a user can create to upload videos
class MyTubeAccount(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=255)
    name = models.CharField(max_length=255)
    description = models.TextField()
    profile_picture = models.ImageField(upload_to='prof_pictures/', default='prof_pictures/default.png')
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return 'http://localhost:5173/' + str(self.name)

    def get_prof_picture(self):
        return 'http://127.0.0.1:8000' + self.profile_picture.url
