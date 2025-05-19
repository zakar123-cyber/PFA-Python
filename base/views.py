from django.views import View
from django.shortcuts import render, get_object_or_404, redirect
from .models import Quiz, QuizScore
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import QuizSerializer, QuizScoreSerializer

# Create your views here.

class Home(View):
    def get(self, request):
        return render(request, 'home.html', {})

    def post(self, request):
        mode = request.POST.get('mode')
        if mode == 'guest':
            request.session['mode'] = 'guest'
            request.session.pop('username', None)  # Ensure no username is stored for guests
            return redirect('quiz_list')
        elif mode == 'ranked':
            request.session['mode'] = 'ranked'  # Ensure mode is set to ranked
            return redirect('ranked_user_form')
        else:
            return HttpResponse("Invalid mode selected", status=400)
        
def quiz_view(request):
    quiz_id = request.GET.get('quiz_id')
    quiz = get_object_or_404(Quiz, id=quiz_id)
    questions = quiz.questions.all().order_by('order')  
    if request.method == "POST":
        score = 0
        total_questions = questions.count()
        user_answers = {}

        for question in questions:
            user_answer = request.POST.get(f"question_{question.id}")
            user_answers[str(question.id)] = user_answer  
            if user_answer == question.correct_option:
                score += 1

        request.session[f"user_answers_{quiz_id}"] = user_answers

        # Save score only if the user is in ranked mode and has a valid username
        if request.session.get('mode') == 'ranked' and request.session.get('username'):
            QuizScore.objects.create(
                username=request.session['username'],
                quiz_name=quiz.title,
                score=score
            )

        return render(request, "quiz_result.html", {
            "score": score,
            "total": total_questions,
            "quiz": quiz,
            "quiz_name": quiz.title  
        })
    else:
        return render(request, 'quiz.html', {'quiz': quiz, 'questions': questions})


def correct_result(request):
    quiz_id = request.GET.get('quiz_id')
    quiz = get_object_or_404(Quiz, id=quiz_id)
    questions = quiz.questions.all()  # Fetch all questions related to the quiz

    user_answers = request.session.get(f"user_answers_{quiz_id}", {})  # Retrieve stored user answers from session

    results = {}
    for question in questions:
        user_answer = user_answers.get(str(question.id))  # Get the user's answer for this question
        correct_answer = question.correct_option  # Get the correct option (e.g., 'A', 'B', etc.)

        # Map the option to the corresponding text
        user_answer_text = getattr(question, f"option_{user_answer.lower()}", "No Answer") if user_answer else "No Answer"
        correct_answer_text = getattr(question, f"option_{correct_answer.lower()}", "No Correct Answer") if correct_answer else "No Correct Answer"

        is_correct = user_answer == correct_answer

        results[question] = {
            'user_answer': user_answer_text,
            'correct_answer': correct_answer_text,
            'is_correct': is_correct,
        }

    return render(request, 'correct_result.html', {'results': results})


class QuizList(View):
    def get(self, request):
        quizs = Quiz.objects.all()
        return render(request, 'QuizList.html', {'quizs': quizs})
    


def ranked_user_form(request):
    if request.method == 'GET':
        return render(request, 'ranked_user_form.html')
    elif request.method == 'POST':
        username = request.POST.get('username')
        if username:
            request.session['username'] = username
            request.session['mode'] = 'ranked'
            return redirect('quiz_list')
        else:
            return HttpResponse("Invalid username", status=400)

def save_score(request, quiz_name):
    if request.session.get('mode') == 'ranked' and request.session.get('username'):
        score = int(request.POST.get('score', 0))
        QuizScore.objects.create(username=request.session['username'],
            quiz_name=quiz_name,
            score=score
        )
    return render(request, 'quiz_result.html', {'score': score, 'quiz_name': quiz_name})

def leaderboard(request, quiz_name):
    scores = QuizScore.objects.filter(quiz_name=quiz_name).order_by('-score')  # Order by descending score
    return render(request, 'leaderboard.html', {
        'quiz_name': quiz_name,
        'scores': scores
    })

# API: List all quizzes
class QuizListAPI(APIView):
    def get(self, request):
        quizzes = Quiz.objects.all()
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data)
    
class leaderboard_api(APIView):
    def get(self, request, quiz_name=None):
        try:
            if quiz_name:
                # Get all scores for specific quiz, not just top 10
                scores = QuizScore.objects.filter(quiz_name=quiz_name).order_by('-score')
                serializer = QuizScoreSerializer(scores, many=True)
                return Response({
                    'scores': serializer.data,
                    'quiz_name': quiz_name
                })
            else:
                # Get all quizzes first
                quizzes = Quiz.objects.all()
                all_scores = {}
                
                # Get all scores for each quiz
                for quiz in quizzes:
                    quiz_scores = QuizScore.objects.filter(quiz_name=quiz.title).order_by('-score')
                    serializer = QuizScoreSerializer(quiz_scores, many=True)
                    all_scores[quiz.title] = serializer.data
                
                return Response(all_scores)
                
        except Exception as e:
            print(f"Error in leaderboard_api: {str(e)}")
            return Response({'error': str(e)}, status=500)