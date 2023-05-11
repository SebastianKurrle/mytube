from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import VideoSerializer
from mytube.generally_permissons import IsAuthenticated
from django.core.files.uploadedfile import SimpleUploadedFile
import tempfile
import os

temp_file = ''

class VideoView(APIView):
    permission_classes = [IsAuthenticated]

    def __init__(self):
        super().__init__()

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

