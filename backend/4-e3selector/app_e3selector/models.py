from django.db import models


class E3StudyPrograms(models.Model):
    name = models.CharField(max_length=255)


class E3Course(models.Model):
    selected = models.BooleanField()
    name = models.CharField(max_length=255)
    url = models.TextField()
    catalog = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    sws = models.CharField(max_length=255)
    num_expected_participants = models.CharField(max_length=255)
    max_participants = models.CharField(max_length=255)
    credit = models.CharField(max_length=255)
    language = models.CharField(max_length=255)
    description = models.TextField()
    timetables = models.TextField()
    location = models.CharField(max_length=255)
    exam_type = models.CharField(max_length=255)
    ausgeschlossen_ingenieurwissenschaften_bachelor = models.CharField(max_length=255)
    e3_study_programs = models.ManyToManyField(E3StudyPrograms)


class E3Rating(models.Model):
    fairness = models.FloatField()
    support = models.FloatField()
    material = models.FloatField()
    fun = models.FloatField()
    comprehensibility = models.FloatField()
    interesting = models.FloatField()
    grade_effort = models.FloatField()
    e3_course = models.ForeignKey(E3Course, on_delete=models.CASCADE)

    def clean(self):
        if self.fairness == "":
            self.fairness = 0.0
        if self.support == "":
            self.support = 0.0
        if self.material == "":
            self.material = 0.0
        if self.fun == "":
            self.fun = 0.0
        if self.comprehensibility == "":
            self.comprehensibility = 0.0
        if self.interesting == "":
            self.interesting = 0.0
        if self.grade_effort == "":
            self.grade_effort = 0.0

    def save(self, *args, **kwargs):
        self.full_clean()
        super(E3Rating, self).save(*args, **kwargs)
