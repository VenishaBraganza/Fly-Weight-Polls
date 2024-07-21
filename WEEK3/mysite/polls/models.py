from django.db import models
from django.utils import timezone
from django.contrib import admin
import datetime

class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField("date published")
    
    def __str__(self):
        return self.question_text

    @admin.display(
        boolean=True,
        ordering="pub_date",
        description="Published recently?",
    )
    def was_published_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) <= self.pub_date <= now

    def Tags(self):
        return list(self.tags.values_list('tag_name', flat=True))

class Tags(models.Model):
    tag_name = models.CharField(max_length=200, unique=True)
    question = models.ManyToManyField(Question, related_name='tags')
    
    def __str__(self):
        return self.tag_name

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.choice_text
