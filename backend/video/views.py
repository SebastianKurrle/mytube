from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import VideoSerializer, EvaluateSerializer
from .models import Video, Evaluate
from users.extensions import get_user_by_token
from mytube_account.models import MyTubeAccount
from django.shortcuts import get_object_or_404
from mytube.generally_permissons import IsAuthenticated
from django.core.files.uploadedfile import SimpleUploadedFile
import os, tempfile

temp_file = ''


class VideoView(APIView):
    permission_classes = [IsAuthenticated]

    # uploads a video in chunks and saves it in a temporary file
    def post(self, request):
        global temp_file
        self.check_permissions(request)

        if int(request.data['uploadedChunks']) == 0:
            temp_file = self.create_tempfile().name

        chunk_data = request.data['chunk']

        with open(temp_file, 'ab') as file:
            file.write(chunk_data.read())

        if int(request.data['remainingChunks']) == 1:
            data = self.create_video_data(request)
            self.save_video(data)

        return Response(status=200)

    # Create the data to save to video when the upload is completed
    def create_video_data(self, request):
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

        return data

    # Saves the video when the upload is completed
    def save_video(self, data):
        serializer = VideoSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        os.remove(temp_file)

    # Create a temporary file
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

        token = request.headers['Authorization'].split(' ')[1]
        user = get_user_by_token(token)

        version = request.query_params['v']
        res = self.evaluate_video(version, video, user)

        if not res:
            return Response(status=400)

        return Response(status=200)

    def get(self, request, id):
        self.check_permissions(request)
        video = get_object_or_404(Video, id=id)

        token = request.headers['Authorization'].split(' ')[1]
        user = get_user_by_token(token)

        evaluation = self.check_evaluation(video, user)

        return Response(evaluation)

    # Checks if and user has liked, disliked or not evaluated a video
    def check_evaluation(self, video, user):
        evaluation = Evaluate.objects.filter(video=video, user=user)
        if evaluation:
            return evaluation[0].evaluate

        # Returns empty string if a user has not evaluated a video
        return ''

    # Checks what version in the query params of the request is selected
    # and saves the evaluation in the database
    def evaluate_video(self, version, video, user):
        data = self.create_evaluate_data(version, video, user)

        if isinstance(data, dict):
            if data != {}:
                serializer = EvaluateSerializer(data=data)
                serializer.is_valid(raise_exception=True)
                serializer.save()

            return True

        return False

    # Creates the data for the serializer to evaluate a video
    # When the user wants to remove a like or a dislike the method returns an empty {}
    # When nothing fits the conditions it returns False
    def create_evaluate_data(self, version, video, user):
        video_likes = Evaluate.objects.filter(video=video, evaluate=0, user=user)
        video_dislikes = Evaluate.objects.filter(video=video, evaluate=1, user=user)

        data = {
            'video': video.id,
            'user': user.id
        }

        if version == 'like' and not video_likes and not video_dislikes:
            data.update({
                'evaluate': 0
            })

            return data

        if version == 'dislike' and not video_dislikes and not video_likes:
            data.update({
                'evaluate': 1
            })

            return data

        if version == 'r-like' and len(video_likes) == 1:
            like = video_likes[0]
            like.delete()
            return {}

        if version == 'r-dislike' and len(video_dislikes) == 1:
            dislike = video_dislikes[0]
            dislike.delete()
            return {}

        return False


class VideoEvaluationCountView(APIView):

    # counts the likes and the dislikes from a video and returns it at response
    def get(self, request, id):
        video = get_object_or_404(Video, id=id)

        video_likes = Evaluate.objects.filter(video=video, evaluate='0').count()
        video_dislikes = Evaluate.objects.filter(video=video, evaluate='1').count()

        data = {
            'likes': video_likes,
            'dislikes': video_dislikes
        }

        return Response(data)
