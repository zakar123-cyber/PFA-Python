from django.db import models
from django.contrib.auth.models import User

class Quiz(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    created_At = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return self.title

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField(null=True, blank=True)
    order = models.IntegerField(default=0)
    option_a = models.CharField(max_length=255, null=True, blank=True)
    option_b = models.CharField(max_length=255, null=True, blank=True)
    option_c = models.CharField(max_length=255, null=True, blank=True)
    option_d = models.CharField(max_length=255, null=True, blank=True)
    correct_option = models.CharField(
        max_length=1,
        choices=[('A', 'Option A'), ('B', 'Option B'), ('C', 'Option C'), ('D', 'Option D')],
        null=True,
        blank=True
    )

    def __str__(self):
        return self.text

    class Meta:
        ordering = ['order']

class QuizScore(models.Model):
    username = models.CharField(max_length=100)
    quiz_name = models.CharField(max_length=100)
    score = models.IntegerField()

    def __str__(self):
        return f"{self.username} - {self.quiz_name} - {self.score}"
