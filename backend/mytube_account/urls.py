from django.urls import path
from . import views

urlpatterns = [
    path('mytube-account/', views.MyTubeAccountView.as_view()),
]
