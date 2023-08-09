from django.db import transaction
import json
import os
import io
from app_e3selector.models import (
    E3StudyPrograms,
    E3Course,
    E3Rating,
)

E3_COURSES_DATA_FILE = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "e3_courses.json")
)


class E3Uploader:
    @transaction.atomic
    def run(self):
        E3Rating.objects.all().delete()
        E3Course.objects.all().delete()
        E3StudyPrograms.objects.all().delete()

        with io.open(E3_COURSES_DATA_FILE, "r", encoding="utf-8") as f:
            e3_data = json.load(f)

        for e3_course in e3_data:
            e3_course_db = E3Course.objects.create(
                selected=e3_course["selected"],
                name=e3_course["Title"],
                url=e3_course["Link"],
                catalog=e3_course["catalog"],
                type=e3_course["Type"],
                sws=e3_course["SWS"],
                num_expected_participants=e3_course["Erwartete Teilnehmer"],
                max_participants=e3_course["Max. Teilnehmer"],
                credit=e3_course["Credits"],
                language=e3_course["Language"],
                description=e3_course["Description"],
                timetables=e3_course["Times_manual"],
                location=e3_course["Location"],
                exam_type=e3_course["Exam"],
                ausgeschlossen_ingenieurwissenschaften_bachelor=e3_course[
                    "Ausgeschlossen_Ingenieurwissenschaften_Bachelor"
                ],
            )

            for excluded_program in e3_course[
                "Ausgeschlossen_Ingenieurwissenschaften_Bachelor"
            ].split(";"):
                (
                    excluded_program_db,
                    _,
                ) = E3StudyPrograms.objects.get_or_create(name=excluded_program)
                e3_course_db.e3_study_programs.add(excluded_program_db)

            def get_float_or_zero(value):
                return round(0.0 if value == "" else float(value), 2)

            e3_rating_db = E3Rating.objects.create(
                fairness=get_float_or_zero(e3_course["fairness"]),
                support=get_float_or_zero(e3_course["support"]),
                material=get_float_or_zero(e3_course["material"]),
                fun=get_float_or_zero(e3_course["fun"]),
                comprehensibility=get_float_or_zero(e3_course["comprehensibility"]),
                interesting=get_float_or_zero(e3_course["interesting"]),
                grade_effort=get_float_or_zero(e3_course["grade_effort"]),
                e3_course=e3_course_db,
            )

            e3_rating_db.save()

        f.close()

        # try:
        #     os.remove(E3_COURSES_DATA_FILE)
        # except FileNotFoundError:
        #     pass
