from django.urls import path
from . import views

urlpatterns = [
    path('mytube-account/', views.MyTubeAccountView.as_view()),
    path('mytube-account/subscribe/', views.MyTubeAccountSubscribeView.as_view()),
    path('mytube-account/settings/<str:name>/', views.MyTubeAccountSettingsView.as_view()),
    path('mytube-account/<str:version>/<str:value>/', views.MyTubeAccountDetailView.as_view()),
]
