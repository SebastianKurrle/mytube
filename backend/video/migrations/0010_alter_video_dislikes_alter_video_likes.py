# Generated by Django 4.1.7 on 2023-05-19 14:11

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('video', '0009_video_dislikes_alter_video_likes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='video',
            name='dislikes',
            field=models.ManyToManyField(blank=True, related_name='disliked_videos', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='video',
            name='likes',
            field=models.ManyToManyField(blank=True, related_name='liked_videos', to=settings.AUTH_USER_MODEL),
        ),
    ]
