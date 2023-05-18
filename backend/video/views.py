from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import VideoSerializer
from .models import Video
from mytube_account.models import MyTubeAccount
from django.shortcuts import get_object_or_404
from mytube.generally_permissons import IsAuthenticated
from django.core.files.uploadedfile import SimpleUploadedFile
import tempfile
import os

temp_file = ''

class VideoView(APIView):
    permission_classes = [IsAuthenticated]

    # uploads a video
    def post(self, request):
        global temp_file
        self.check_permissions(request)

        if int(request.data['uploadedChunks']) == 0:
            temp_file = self.create_tempfile().name

        chunk_data = request.data['chunk']

        with open(temp_file, 'ab') as file:
            file.write(chunk_data.read())

        if int(request.data['remainingChunks']) == 1:
            with open(temp_file, 'rb') as f:
                data = f.read()
                video = SimpleUploadedFile(f'{os.path.basename(temp_file)}.mp4', data)

            data = {
                'name': request.data['name'],
                'video': video,
                'description': request.data['description'],
                'thumbnail': request.data['thumbnail'],
                'mt_account': request.data['mt_account']
            }

            serializer = VideoSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            os.remove(temp_file)

        return Response(status=200)

    def create_tempfile(self):
        return tempfile.NamedTemporaryFile(delete=False)


class VideoDetailView(APIView):

    # gets a video by an id
    def get(self, reqeust, id):
        video = get_object_or_404(Video, id=id)

        serializer = VideoSerializer(video)
        return Response(serializer.data)


class VideoFromMTAccountView(APIView):

    # gets all videos from a MyTubeAccount
    def get(self, request, mt_account_id):
        mt_account = MyTubeAccount.objects.get(id=mt_account_id)

        videos = Video.objects.filter(mt_account=mt_account)
        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data)


class VideoEvaluationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        self.check_permissions(request)
        video = get_object_or_404(Video, id=id)

        version = request.query_params['v']
        self.evaluate_video(version, video)

        return Response(status=200)

    def evaluate_video(self, version, video):
        if version == 'like':
            video.likes += 1
        elif version == 'dislike':
            video.dislikes += 1
        elif version == 'r-like':
            video.likes -= 1
        elif version == 'r-dislike':
            video.dislikes -= 1

        video.save()
