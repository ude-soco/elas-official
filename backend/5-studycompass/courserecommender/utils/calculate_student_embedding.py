from courserecommender.models import *
import numpy as np


def calculate_student_embedding(student):
    try:
        emdedding_sum = np.array([0])
        count = 0
        for course in student.enroll.match(passed=True):
            embedding = np.array(course.embedding)
            emdedding_sum = emdedding_sum + embedding
            count += 1
        student_embedding = emdedding_sum / count
        student.embedding = student_embedding
        student.save()
    except Exception as e:
        print(e)
