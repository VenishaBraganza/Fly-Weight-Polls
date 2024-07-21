from django.urls import path
from . import views

app_name = "polls"
urlpatterns = [
    path("", views.polls_controller, name="get_views"),
    path('<int:question_id>/', views.increment_poll_vote, name='increment_poll_vote'),
    path('polls/<int:question_id>/', views.get_poll_data, name='get_poll_data'),
    path('tags/', views.list_tags, name='list_tags'),
    path('polls/', views.get_filter_polls, name='filter_polls'),    
    path('api/tags/', views.list_tags, name='list_tags'),
    path('get_filter_polls', views.get_filter_polls, name='get_filter_polls'),
    path('polls/delete_empty_polls/', views.delete_empty_polls, name='delete_empty_polls'),
    path('tags/delete_empty_tags/', views.delete_empty_tags, name='delete_empty_tags'),
]
