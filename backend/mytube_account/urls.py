from django.urls import path
from . import views

urlpatterns = [
    path('mytube-account/', views.MyTubeAccountView.as_view()),
    path('mytube-account/<str:id>/', views.MyTubeAccountView.as_view())
]
