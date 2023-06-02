from django.core.files.storage import default_storage
from rest_framework import serializers, validators
from rest_framework.exceptions import ErrorDetail
from .models import MyTubeAccount, Subscribe
from uuid import uuid4


class MyTubeAccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = MyTubeAccount

        fields = (
            'id',
            'name',
            'description',
            'profile_picture',
            'owner',
            'get_absolute_url',
            'get_prof_picture'
        )

        extra_kwargs = {
            'name': {
                'validators': [
                    validators.UniqueValidator(
                        MyTubeAccount.objects.all(), ErrorDetail('A MyTube account with that name already exists')
                    )
                ]
            }
        }

    def create(self, validated_data):
        id = uuid4()
        name = validated_data.get('name')
        desc = validated_data.get('description')
        prof_pic = validated_data.get('profile_picture')
        owner = validated_data.get('owner')

        mytube_account = MyTubeAccount.objects.create(id=id, name=name, description=desc, owner=owner)

        if prof_pic is not None:
            mytube_account.profile_picture = prof_pic
            mytube_account.save()

        return mytube_account

    # updates a MyTube Account
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name')
        instance.description = validated_data.get('description')
        instance.profile_picture = instance.profile_picture

        if validated_data.get('profile_picture'):
            if instance.profile_picture != 'prof_pictures/default.png':
                default_storage.delete(instance.profile_picture.name)

            instance.profile_picture = validated_data.get('profile_picture')

        instance.save()

        return instance


class MyTubeAccountSubscribeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subscribe

        fields = '__all__'

    def create(self, validated_data):
        id = uuid4()

        subscribe = Subscribe.objects.create(id=id, **validated_data)
        return subscribe
