from django.urls import path
from . import views

urlpatterns = [
    path('video/', views.VideoView.as_view()),
    path('video/<str:id>/', views.VideoDetailView.as_view()),
    path('video/<str:id>/evaluate/', views.VideoEvaluationView.as_view()),
    path('video/<str:id>/evaluate/count/', views.VideoEvaluationCountView.as_view()),
    path('video/mtaccount/<str:mt_account_id>/', views.VideoFromMTAccountView.as_view())
]
