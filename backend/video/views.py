from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import VideoSerializer
from mytube.generally_permissons import IsAuthenticated


class VideoView(APIView):
    permission_classes = [IsAuthenticated]

    # uploads a video
    def post(self, request):
        self.check_permissions(request)

        serializer = VideoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
