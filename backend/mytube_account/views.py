from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import MyTubeAccountSerializer
from .models import MyTubeAccount
from django.shortcuts import get_object_or_404


class MyTubeAccountView(APIView):

    # creates an MyTube account
    def post(self, request):
        serializer = MyTubeAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    # gets an account with an id
    def get(self, request, id):
        mytube_account = get_object_or_404(MyTubeAccount, id=id)
        serializer = MyTubeAccountSerializer(mytube_account)

        return Response(serializer.data)

