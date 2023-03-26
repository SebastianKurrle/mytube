from rest_framework import serializers, validators
from rest_framework.exceptions import ErrorDetail
from .models import MyTubeAccount


class MyTubeAccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = MyTubeAccount

        fields = (
            'id',
            'name',
            'description',
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