# Generated by Django 4.1.7 on 2023-05-19 14:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('video', '0010_alter_video_dislikes_alter_video_likes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='video',
            name='dislikes',
        ),
        migrations.RemoveField(
            model_name='video',
            name='likes',
        ),
        migrations.CreateModel(
            name='Evaluate',
            fields=[
                ('id', models.UUIDField(default=uuid.UUID('cc8f247f-5677-4620-a23d-6c8bdf8327e3'), primary_key=True, serialize=False)),
                ('evaluate', models.CharField(choices=[(0, 'like'), (1, 'dislike')], max_length=255)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('video', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='video.video')),
            ],
        ),
    ]
