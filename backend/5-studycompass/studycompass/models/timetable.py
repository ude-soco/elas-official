from django.db import models


class Timetable(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    day = models.CharField(max_length=255)
    time_from = models.CharField(max_length=255)
    time_to = models.CharField(max_length=255)
    rhythm = models.CharField(max_length=255)
    duration = models.CharField(max_length=255)
    duration_from = models.DateField()
    duration_to = models.DateField()
    room = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    comment = models.CharField(max_length=255)
    elearn = models.CharField(max_length=255)
    link = models.CharField(max_length=255)
    lecture = models.ForeignKey(to="studycompass.Lecture", on_delete=models.CASCADE)
    dates = models.JSONField()
