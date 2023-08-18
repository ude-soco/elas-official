from courserecommender.models import *


def add_to_blacklist(student, course):
    try:
        student.blacklist.connect(course)
    except Exception as e:
        print(e)


def remove_from_blacklist(student, course):
    try:
        student.blacklist.disconnect(course)
    except Exception as e:
        print(e)
