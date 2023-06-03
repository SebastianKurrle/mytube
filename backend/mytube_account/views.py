from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import MyTubeAccountSerializer, MyTubeAccountSubscribeSerializer
from .models import MyTubeAccount, Subscribe
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
        user = get_user_by_token(request)

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


class MyTubeAccountSubscribeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        self.check_permissions(request)

        if self.check_user_subscribed(request.data['mt_account'], request.data['user']):
            return Response({'message': 'User has already subscribed'}, status=204)

        serializer = MyTubeAccountSubscribeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=200)

    def delete(self, request):
        self.check_permissions(request)

        mt_account = request.data['mt_account']
        user = request.data['user']

        if not self.check_user_subscribed(mt_account, user):
            return Response({'message': 'User is not subscriber of the MyTube account'}, status=204)

        subscribe = Subscribe.objects.get(mt_account=mt_account, user=user)
        subscribe.delete()

        return Response(status=200)

    # Checks if a user has subscribed a mytube account yet
    def check_user_subscribed(self, mt_account, user):
        return len(Subscribe.objects.filter(mt_account=mt_account, user=user)) == 1


class MyTubeAccountSubscribeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    # Checks if a user has subscribed a mytube account and returns the response with the result
    def get(self, request, mt_account_id):
        self.check_permissions(request)
        mt_account = get_object_or_404(MyTubeAccount, id=mt_account_id)

        user = get_user_by_token(request)

        subscribed = len(Subscribe.objects.filter(mt_account=mt_account, user=user)) == 1

        return Response({'subscribed': subscribed})
