from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import MyTubeAccountSerializer
from .models import MyTubeAccount
from django.shortcuts import get_object_or_404
from mytube.generally_permissons import IsAuthenticated
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

