from django.urls import path,re_path

from . import views

app_name = "polls"
urlpatterns = [
    path("",views.polls_controller, name="get_views"),
    path("", views.IndexView.as_view(), name="index"),
    path("<int:pk>/", views.DetailView.as_view(), name="detail"),
    path("<int:pk>/results/", views.ResultsView.as_view(), name="results"),
    path("<int:question_id>/vote/", views.vote, name="vote"),
    path('polls/', views.get_filter_polls, name='filter_polls'),
     
   # re_path(r'^polls/\?tags=(?P<tags>[\w,]+)$', views.get_filter_polls, name='filter_polls'),
    
    path('polls/', views.get_filter_polls, name='filter_polls'),  # Keep the filter_polls endpoint
    path('polls/<int:question_id>/', views.increment_poll_vote, name='increment_poll_vote'),
    
    
    
    path('get-poll-data/<int:question_id>/', views.get_poll_data, name='get_poll_data'),
    path('tags/', views.list_tags, name='list_tags'),
    path('polls/', views.get_filter_polls, name='filter_polls'),
]

