from django.db import models
from mytube_account.models import MyTubeAccount


class Video(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=255)
    name = models.CharField(max_length=255)
    video = models.FileField(upload_to='videos/')
    description = models.TextField(null=True)
    thumbnail = models.ImageField(upload_to='videos-thumbnails/')
    likes = models.PositiveIntegerField(default=0)
    dislikes = models.PositiveIntegerField(default=0)
    mt_account = models.ForeignKey(MyTubeAccount, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return f'http://localhost:5173/video/{self.id}'

    def get_video(self):
        return f'http://127.0.0.1:8000{self.video.url}'

    def get_thumbnail(self):
        return f'http://127.0.0.1:8000{self.thumbnail.url}'
