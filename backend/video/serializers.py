import random

from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile
from .models import Video
from uuid import uuid4
from PIL import Image
from io import BytesIO
from random import getrandbits


class VideoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Video

        fields = (
            'id',
            'name',
            'video',
            'description',
            'thumbnail',
            'mt_account',
            'get_absolute_url',
            'get_video',
            'get_thumbnail'
        )

    # creates a video
    def create(self, validated_data):
        id = uuid4()
        name = validated_data.get('name')
        video = validated_data.get('video')
        description = validated_data.get('description')
        thumbnail = validated_data.get('thumbnail')
        mt_account = validated_data.get('mt_account')

        video = Video.objects.create(id=id, name=name, video=video, description=description, thumbnail=thumbnail, mt_account=mt_account)
        return video
