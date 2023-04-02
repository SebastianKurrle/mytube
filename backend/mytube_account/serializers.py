from rest_framework import serializers, validators
from rest_framework.exceptions import ErrorDetail
from .models import MyTubeAccount
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
