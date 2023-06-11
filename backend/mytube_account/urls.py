from django.urls import path
from . import views

urlpatterns = [
    path('mytube-account/', views.MyTubeAccountView.as_view()),
    path('mytube-account/subscribe/', views.MyTubeAccountSubscribeView.as_view()),
    path('mytube-account/subscribe/<str:mt_account_id>/', views.count_subscribers),
    path('mytube-account/subscribe/check/<str:mt_account_id>/', views.MyTubeAccountSubscribeDetailView.as_view()),
    path('mytube-account/settings/<str:name>/', views.MyTubeAccountSettingsView.as_view()),
    path('mytube-account/<str:id>/', views.MyTubeAccountView.as_view()),
    path('mytube-account/<str:version>/<str:value>/', views.MyTubeAccountDetailView.as_view()),
]
