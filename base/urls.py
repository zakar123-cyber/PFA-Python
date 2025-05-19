from django.urls import path
from .views import Home, QuizList, QuizListAPI, leaderboard_api
from . import views

urlpatterns = [
    path('', Home.as_view(), name='home'),
    path('quiz/', views.quiz_view, name='quiz'),
    path('quiz_list/', QuizList.as_view(), name='quiz_list'),
    path('correct_result/', views.correct_result, name='correct_result'),
    path('ranked-user-form/', views.ranked_user_form, name='ranked_user_form'),
    path('save-score/<str:quiz_name>/', views.save_score, name='save_score'),
    path('leaderboard/<str:quiz_name>/', views.leaderboard, name='leaderboard'),
    # API endpoints for React
    path('api/quizzes/', QuizListAPI.as_view(), name='api_quiz_list'),
    path('api/leaderboard/', leaderboard_api.as_view(), name='api_leaderboard_all'),
    path('api/leaderboard/<str:quiz_name>/', leaderboard_api.as_view(), name='api_leaderboard'),
]
