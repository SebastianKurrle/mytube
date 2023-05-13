from django.urls import path
from . import views

urlpatterns = [
    path('video/', views.VideoView.as_view()),
    path('video/<str:id>/', views.VideoDetailView.as_view())
]
