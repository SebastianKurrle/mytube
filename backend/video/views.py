from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import \
    VideoSerializer, \
    VideoGETSerializer, \
    EvaluateSerializer, \
    CommentSerializer, \
    CommentGETSerializer
from .models import Video, Evaluate, Comment
from mytube_account.models import Subscribe
from .permissons import IsCommentWriter
from users.extensions import get_user_by_token
from mytube_account.models import MyTubeAccount
from django.shortcuts import get_object_or_404
from django.db.models import Q
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


class VideoSuggestionView(APIView):

    # Gets the suggested videos
    def get(self, request):
        authenticated = request.query_params['auth']

        if authenticated == 'true':
            user = get_user_by_token(request)
            subscribed_accounts = self.get_subscribed_mt_accounts(user)
            suggested_videos = self.suggested_videos_subscribed_accounts(subscribed_accounts)

            serializer = VideoGETSerializer(suggested_videos, many=True)

            return Response({'videos': serializer.data})

        suggested_videos = self.suggested_videos_latest_most_popular()
        serializer = VideoGETSerializer(suggested_videos, many=True)

        return Response({'videos': serializer.data})

    # Gets all subscribed MyTube accounts from a user
    def get_subscribed_mt_accounts(self, user):
        return Subscribe.objects.filter(user=user).values_list('mt_account', flat=True)

    # Gets the 10 latest videos from the MyTube accounts the user subscribed
    # If the user has 0 subscribed MyTube accounts it will return the latest and most popular videos
    def suggested_videos_subscribed_accounts(self, sub_accounts):
        videos = Video.objects.filter(mt_account__in=sub_accounts).order_by('-datetime_posted')[:10]

        if len(videos) == 0:
            return self.suggested_videos_latest_most_popular()

        return videos

    # Gets the 10 latest videos based on the calls
    # (only used if the user is unauthenticated or has 0 subscribed MyTube Accounts)
    def suggested_videos_latest_most_popular(self):
        return Video.objects.all().order_by('-datetime_posted', '-calls')[:10]


class VideoDetailView(APIView):

    # gets a video by an id
    def get(self, reqeust, id):
        video = get_object_or_404(Video, id=id)

        video.calls += 1
        video.save()

        comments = Comment.objects.filter(video=video).count()
        serializer = VideoGETSerializer(video)

        data = {
            'video': serializer.data,
            'extras': {
                'comments': comments
            }
        }

        return Response(data)


class VideoFromMTAccountView(APIView):

    # gets all videos from a MyTubeAccount
    def get(self, request, mt_account_id):
        mt_account = MyTubeAccount.objects.get(id=mt_account_id)

        videos = Video.objects.filter(mt_account=mt_account).order_by('-datetime_posted')
        serializer = VideoGETSerializer(videos, many=True)
        return Response(serializer.data)


class VideoSearchView(APIView):

    def get(self, request):
        query = request.query_params['query']

        query_result = Video.objects.filter(Q(name__icontains=query) |
                                            Q(description__icontains=query)).order_by('-datetime_posted', '-calls')

        serializer = VideoGETSerializer(query_result, many=True)

        return Response({'searchResult': serializer.data})


class VideoEvaluationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        self.check_permissions(request)
        video = get_object_or_404(Video, id=id)

        user = get_user_by_token(request)

        version = request.query_params['v']
        res = self.evaluate_video(version, video, user)

        if not res:
            return Response(status=400)

        return Response(status=200)

    def get(self, request, id):
        self.check_permissions(request)
        video = get_object_or_404(Video, id=id)

        user = get_user_by_token(request)

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


class CommentView(APIView):
    permission_classes = [IsAuthenticated, IsCommentWriter]

    def post(self, request):
        self.check_permissions(request)

        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    # Updates the message from a comment
    def put(self, request, id):
        self.check_permissions(request)
        comment = get_object_or_404(Comment, id=id)
        self.check_object_permissions(request, comment)

        data = {
            'video': comment.video.id,
            'message': request.data['message'],
            'user': comment.user.id
        }

        serializer = CommentSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.update(comment, serializer.validated_data)

        return Response(status=200)

    def delete(self, request, id):
        self.check_permissions(request)
        comment = get_object_or_404(Comment, id=id)
        self.check_object_permissions(request, comment)

        comment.delete()

        return Response(status=204)


class CommentLoadView(APIView):

    """
        The function returns 5 comments from a video depends on the datetime
        hand over by the query params if the param equals now it returns the 5 newest
        comments if the param is a datetime it returns the 5 newest away from this datetime
    """
    def get(self, request, id):
        video = get_object_or_404(Video, id=id)

        query = request.query_params['value']
        posted = request.query_params['posted']
        if posted == 'true':
            comment = get_object_or_404(Comment, id=query)
            serializer = CommentGETSerializer(comment)

            return Response(serializer.data)

        if query == 'now':
            comments = Comment.objects.filter(video=video).order_by('-datetime_posted')[:5]
        else:
            start_datetime = query
            comments = Comment.objects.filter(datetime_posted__lt=start_datetime, video=video).order_by('-datetime_posted')[:5]

        serializer = CommentGETSerializer(comments, many=True)

        return Response(serializer.data)

