from django.db import models


class Lecture(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    url = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    subject_type = models.CharField(max_length=255)
    semester = models.CharField(max_length=255)
    sws = models.CharField(max_length=255)
    longtext = models.CharField(max_length=255)
    shorttext = models.CharField(max_length=255)
    language = models.CharField(max_length=255)
    hyperlink = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    timetables = models.ManyToManyField(
        to="studycompass.Timetable", related_name="lectures"
    )
    professors = models.ManyToManyField(to="studycompass.Professor")
    root_id = models.ManyToManyField(
        "studycompass.StudyProgram",
        through="Lecture_StudyProgram",
        related_name="lectures",
    )
    keywords = models.JSONField()


class Lecture_StudyProgram(models.Model):
    lecture = models.ForeignKey("studycompass.Lecture", on_delete=models.CASCADE)
    studyprogram = models.ForeignKey(
        "studycompass.StudyProgram", on_delete=models.CASCADE
    )
