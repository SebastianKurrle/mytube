from rest_framework import serializers
from .models import Video, Evaluate, Comment
from users.serializers import UserSerializer
from uuid import uuid4


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


class EvaluateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Evaluate
        fields = (
            '__all__'
        )

    def create(self, validated_data):
        id = uuid4()

        evaluate = Evaluate.objects.create(id=id, **validated_data)
        return evaluate


class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'

    def create(self, validated_data):
        id = uuid4()

        comment = Comment.objects.create(id=id, **validated_data)
        return comment


class CommentGETSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Comment
        fields = (
            'id',
            'message',
            'datetime_posted',
            'video',
            'user'
        )
