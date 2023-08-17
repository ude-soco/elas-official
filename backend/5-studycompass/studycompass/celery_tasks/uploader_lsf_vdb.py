from django.db import transaction
from ..models import Lecture, Timetable, Professor, StudyProgram
import os
import io
import json
import datetime

MERGED_LECTURES_VDB_DATA_FILE = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__), "..", "data", "merged_lecture_description.json"
    )
)
STUDY_PROGRAMS_LIST_FILE = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "study_programs.json")
)


class LSFVDBUploader:
    @transaction.atomic
    def upload_data(self):
        StudyProgram.objects.all().delete()
        Timetable.objects.all().delete()
        Professor.objects.all().delete()
        Lecture.objects.all().delete()

        professors_dict = {}
        studyprograms_dict = {}

        with io.open(STUDY_PROGRAMS_LIST_FILE, "r") as studyprograms_data:
            studyprograms_json = json.load(studyprograms_data)
            for studyprogram in studyprograms_json:
                if studyprogram["id"] not in studyprograms_dict.keys():
                    studyprograms_dict[
                        studyprogram["id"]
                    ] = StudyProgram.objects.create(
                        id=studyprogram["id"],
                        name=studyprogram["name"],
                        url=studyprogram["url"],
                    )

        with io.open(MERGED_LECTURES_VDB_DATA_FILE, "r", encoding="utf8") as data_file:
            data_json = json.load(data_file)
            print(len(data_json))
            for lecture in data_json:
                professors = lecture["persons"]
                for professor in professors:
                    if professor["id"] not in professors_dict.keys():
                        professors_dict[professor["id"]] = Professor.objects.create(
                            id=professor["id"],
                            name=professor["name"],
                            url=professor["url"],
                        )

            count = 0
            # date_regex = (
            #     "\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$"
            # )
            for lecture in data_json:
                lecture_id = lecture["id"]
                lecture_url = lecture["url"]
                lecture_name = lecture["name"]
                lecture_subject_type = lecture["subject_type"]
                lecture_semester = lecture["semester"]
                lecture_sws = lecture["sws"]
                lecture_longtext = lecture["longtext"]
                lecture_shorttext = lecture["shorttext"]
                lecture_language = lecture["language"]
                lecture_hyperlink = lecture["hyperlink"]
                lecture_description = lecture["description"]
                lecture_keywords = lecture["keywords"]

                if lecture_subject_type == "Übung" and "Übung" not in lecture_name:
                    lecture_name = "Übung zu " + lecture_name
                elif (
                    lecture_subject_type == "Übung/mit Tutorien"
                    and "Übung/mit Tutorien" not in lecture_name
                ):
                    lecture_name = "Übung/mit Tutorien zu " + lecture_name
                elif (
                    lecture_subject_type == "Tutorium"
                    and "Tutorium" not in lecture_name
                ):
                    lecture_name = "Tutorium zu " + lecture_name
                elif (
                    lecture_subject_type == "Einführung"
                    and "Einfürhrung" not in lecture_name
                ):
                    lecture_name = "Einführung zu " + lecture_name

                temp_lecture = Lecture.objects.create(
                    id=lecture_id,
                    name=lecture_name,
                    url=lecture_url,
                    subject_type=lecture_subject_type,
                    semester=lecture_semester,
                    sws=lecture_sws,
                    longtext=lecture_longtext,
                    shorttext=lecture_shorttext,
                    language=lecture_language,
                    hyperlink=lecture_hyperlink,
                    description=lecture_description,
                    keywords=lecture_keywords,
                )

                professors = lecture["persons"]
                for professor in professors:
                    temp_lecture.professors.add(professors_dict[professor["id"]])

                root_id = lecture["root_id"]
                for root in root_id:
                    temp_lecture.root_id.add(studyprograms_dict[root])

                timetable_entries = lecture["timetable"]
                for timetable_entry in timetable_entries:
                    if timetable_entry["id"] == "":
                        timetable_entry["id"] = str(count)
                        count += 1

                    duration = ""
                    duration_from = duration_to = datetime.date(1999, 2, 4)
                    if type(timetable_entry["duration"]) == str:
                        if "am" in timetable_entry["duration"]:
                            duration = "AM"
                        elif "von" in timetable_entry["duration"]:
                            duration = "VON"
                        elif len(timetable_entry["duration"]) == 0:
                            duration = "EMPTY"

                    dates = []
                    if "dates" in timetable_entry.keys():
                        dates = timetable_entry["dates"]
                        if len(dates) > 0:
                            duration_from = dates[0]
                            duration_to = dates[-1]

                    temp_entry = Timetable.objects.create(
                        lecture_id=temp_lecture.pk,
                        id=timetable_entry["id"],
                        day=timetable_entry["day"],
                        time_from=timetable_entry["time"]["from"],
                        time_to=timetable_entry["time"]["to"],
                        rhythm=timetable_entry["rhythm"],
                        duration=duration,
                        duration_from=duration_from,
                        duration_to=duration_to,
                        room=timetable_entry["room"],
                        status=timetable_entry["status"],
                        comment=timetable_entry["comment"],
                        elearn=timetable_entry["elearn"],
                        link=timetable_entry["einzeltermine_link"],
                        dates=dates,
                    )
                    temp_lecture.timetables.add(temp_entry)
