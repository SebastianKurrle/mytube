from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import MyTubeAccountSerializer
from .models import MyTubeAccount
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from mytube.generally_permissons import IsAuthenticated
from .permissons import IsMyTubeAccountOwner
from users.extensions import get_user_by_token


class MyTubeAccountView(APIView):
    permission_classes = [IsAuthenticated]

    # creates an MyTube account
    def post(self, request):
        self.check_permissions(request)

        serializer = MyTubeAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    # gets all mytube accounts from a user
    def get(self, request):
        token = request.headers['Authorization'].split(' ')[1]
        user = get_user_by_token(token)

        mytube_accounts = MyTubeAccount.objects.filter(owner=user)
        serializer = MyTubeAccountSerializer(mytube_accounts, many=True)

        return Response(serializer.data)

    # deletes an account by an id
    def delete(self, request, id):
        instance = MyTubeAccount.objects.get(id=id)

        if instance is None:
            return Response(status=404)

        instance.delete()
        return Response(status=200)


class MyTubeAccountSettingsView(APIView):
    permission_classes = [IsAuthenticated, IsMyTubeAccountOwner]

    def get(self, request, name):
        self.check_permissions(request)
        mt_account = get_object_or_404(MyTubeAccount, name=name)
        self.check_object_permissions(request, mt_account)

        serializer = MyTubeAccountSerializer(mt_account)

        return Response(serializer.data)

    # updates a MyTube Account
    def put(self, request, name):
        self.check_permissions(request)
        mt_account = get_object_or_404(MyTubeAccount, name=name)
        self.check_object_permissions(request, mt_account)

        serializer = MyTubeAccountSerializer(instance=mt_account, data=request.data, partial=True)
        serializer.is_valid()
        serializer.update(serializer.instance, serializer.validated_data)

        return Response(status=200)

    def delete(self, request, name):
        self.check_permissions(request)
        mt_account = get_object_or_404(MyTubeAccount, name=name)
        self.check_object_permissions(request, mt_account)

        if mt_account.profile_picture != 'prof_pictures/default.png':
            default_storage.delete(mt_account.profile_picture.name)

        mt_account.profile_picture = 'prof_pictures/default.png'
        mt_account.save()

        return Response(status=200)


class MyTubeAccountDetailView(APIView):

    # gets a MyTube account
    # by name or by id
    def get(self, request, version, value):
        if version == 'id':
            mt_account = get_object_or_404(MyTubeAccount, id=value)
        elif version == 'name':
            mt_account = get_object_or_404(MyTubeAccount, name=value)

        serializer = MyTubeAccountSerializer(mt_account)
        return Response(serializer.data)
