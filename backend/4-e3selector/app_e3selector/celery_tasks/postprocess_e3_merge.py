from difflib import SequenceMatcher
import io
import json
import math
import os
import pprint
import re
from datetime import time

pp = pprint.PrettyPrinter(indent=4)

E3_COURSE_CATALOG_DATA_FILE = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "e3_course_catalog.json")
)

POSTPROCESSED_E3_RATING_DATA_FILE = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "data",
        "post_processed_e3_course_ratings.json",
    )
)

E3_COURSES_DATA_FILE = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "e3_courses.json")
)


class ProcessMergeE3CoursesAndRatings:
    # clean the destination directory before filling it with new data
    def clear_output_directories(self):
        open(E3_COURSES_DATA_FILE, "w").close()

    def find_ratings(self, ratings, title):
        for rating in ratings:
            # courses are not named the same on meinprof.de as in the LSF
            similarity = SequenceMatcher(None, title, rating["name"]).ratio()
            if similarity > 0.65:
                return {
                    "fairness": rating["fairness"] / 100 if rating["fairness"] else 0,
                    "support": rating["support"] / 100 if rating["support"] else 0,
                    "material": rating["material"] / 100 if rating["material"] else 0,
                    "fun": rating["fun"] / 100 if rating["fun"] else 0,
                    "comprehensibility": rating["understandability"] / 100
                    if rating["understandability"]
                    else 0,
                    "interesting": rating["interest"] / 100
                    if rating["interest"]
                    else 0,
                    "grade_effort": rating["node_effort"] / 100
                    if rating["node_effort"]
                    else 0,
                }
        return None

    def clean_credits(self, credits):
        if len(credits) < 1:
            return "0"

        partials = credits.split("-")
        if len(partials) == 1:
            return partials[0]

        try:
            if int(partials[0]) == int(partials[1]):
                return str(partials[0])
        except Exception:
            return "0"

        return credits

    def clean_description(self, text):
        text = re.sub(r"Inhalte:[\s\\r\\n]+", "", text)
        return text

    def convert_timetable(self, timetable):
        flattime = []
        for dates in timetable:
            try:
                dates["day"] = dates["day"].replace("\xa0", " ").strip()
                if dates["day"][:2] != "-.":
                    dates["time"] = dates["time"].replace("\xa0", " ").strip()
                    start = math.floor(int(dates["time"][:2]) / 2.0) * 2
                    time_start = time(hour=start, minute=0)
                    time_end = time(hour=start + 2, minute=0)
                    flattime.append(
                        {
                            "day": dates["day"][:2],
                            "time": f"{time_start.strftime('%H:%M')} - {time_end.strftime('%H:%M')}",
                            "start_time": f"{time_start.strftime('%H:%M')}",
                            "end_time": f"{time_end.strftime('%H:%M')}",
                            "rhythm": dates["rhythm"],
                            "comment": dates["comment"],
                            "elearn": dates["elearn"],
                        }
                    )
            except ValueError:
                continue
        return flattime

    def get_locations(self, timetable):
        locations = set()

        for date in timetable:
            loc = date["comment"]

            if "Dortmund" in loc:
                locations.add("Dortmund")
            elif "online" in loc:
                locations.add("online")
            elif any(word in loc for word in ["Ruhr", "Bochum", "HNC", "RUB"]):
                locations.add("Bochum")
            elif (
                "Essen" in loc
                or loc.startswith("E ")
                or (len(loc.split(": ")) > 1 and loc.split(": ")[1].startswith("E "))
            ):
                locations.add("Essen")
            elif (
                "Duisburg" in loc
                or loc.startswith("D ")
                or (len(loc.split(": ")) > 1 and loc.split(": ")[1].startswith("D "))
            ):
                locations.add("Duisburg")
            elif "E-Learning" in date["elearn"]:
                locations.add("online")

        if not len(locations):
            return "unknown"
        else:
            return ";".join(locations)

    def get_exams(self, text):
        markers = {
            "Präsentation": ["referat", "präsentation", "presentation"],
            "Mündliche Prüfung": ["mündlich", "oral"],
            "Klausur": [
                "schriftlich",
                "klausur",
                "exam",
                "e-klausur",
                "präsenz",
                "written",
            ],
            "Essay": [
                "seitig",
                "page",
                "besprechung",
                "essay",
                "hausarbeit",
                "ausarbeitung",
                "seiten",
                "hausaufgabe",
                "dokumentation",
                "documentation",
                "protokoll",
                "zeichen",
                "character",
                "tagebuch",
                "diary",
                "assignment",
                "portfolio",
            ],
        }

        weight = {"Präsentation": 0, "Mündliche Prüfung": 0, "Klausur": 0, "Essay": 0}

        text = text.lower()

        for key, item in markers.items():
            for marker in item:
                weight[key] += text.count(marker)

        if sum(weight.values()) == 0:
            return "unknown"

        return max(weight, key=lambda k: weight[k])

    def get_excluded(self, text):
        shorthand = {
            "BauIng": "Bauingenieurwesen",
            "Komedia": "Komedia",
            "ISE": "ISE",
            "Maschinenbau": "Maschinenbau",
            "EIT": "Elektrotechnik und Informationstechnik",
            "Medizintechnik": "Medizintechnik",
            "NanoEng": "Nano Engineering",
            "Wi-Ing": "Wirtschaftsingenieurwesen",
            "Angewandte Informatik": "Angewandte Informatik",
            "Ang. Inf.": "Angewandte Informatik",
        }

        overrides = {
            "IngWi": "ALLE",
            "Alle außer BauIng (1. FS)": "ALLE (außer Bauingenieurwesen (1. FS))",
            "IngWi (außer BauIng)": "ALLE (außer Bauingenieurwesen)",
        }

        text = re.sub(r"\(IngWi\)", "IngBRACESWi", text)
        text = re.sub(r"\(IngWi & WiWi\)", "IngBRACESWiWi", text)
        text = re.sub(r"[^0-9a-zA-Z,.-]+", " ", text)

        for key, item in overrides.items():
            if key in text:
                return item

        excluded = []

        for key, item in shorthand.items():
            if key in text:
                excluded.append(item)

        return ";".join(excluded) if len(excluded) else "ALLE"

    def run(self):
        self.clear_output_directories()
        with io.open(
            E3_COURSE_CATALOG_DATA_FILE, encoding="utf8", errors="ignore"
        ) as courses_file:
            courses = json.load(courses_file)
            with io.open(
                POSTPROCESSED_E3_RATING_DATA_FILE, encoding="utf8", errors="ignore"
            ) as ratings_file:
                ratings = json.load(ratings_file)
                processed_courses = []

                # Keeps track of number of ratings & sum total of rates
                avg_ratings = {
                    "fairness": 0,
                    "support": 0,
                    "material": 0,
                    "fun": 0,
                    "comprehensibility": 0,
                    "interesting": 0,
                    "grade_effort": 0,
                }
                ratings_count = 0

                for course in courses:
                    # check for duplicates
                    if course["url"] in [c["Link"] for c in processed_courses]:
                        continue

                    # Rename the dict keys and populate with processed data
                    processed_course = {
                        "selected": False,
                        "Title": course["name"],
                        "Link": course["url"],
                        "catalog": course["parent_id"],
                        "Type": course["subject_type"],
                        "SWS": course["sws"] if course["sws"] != " " else "",
                        "Erwartete Teilnehmer": course["expected"],
                        "Max. Teilnehmer": course["max"],
                        "Credits": self.clean_credits(course["credits"]),
                        "Language": course["language"],
                        "Description": self.clean_description(course["description"]),
                        "Times_manual": self.convert_timetable(course["timetable"]),
                        "Location": self.get_locations(course["timetable"]),
                        "Exam": self.get_exams(course["exam"]),
                        "Ausgeschlossen_Ingenieurwissenschaften_Bachelor": self.get_excluded(
                            course["excluded"]
                        ),
                    }

                    # integrate the ratings, if they exist
                    course_ratings = self.find_ratings(ratings, course["name"])
                    if course_ratings:
                        # update the ratings tracker
                        ratings_count += 1
                        for key, item in avg_ratings.items():
                            avg_ratings[key] += course_ratings[key]

                        # processed_course = processed_course | course_ratings
                        processed_course = {**processed_course, **course_ratings}

                    else:
                        processed_course = {
                            **processed_course,
                            **{
                                "fairness": "",
                                "support": "",
                                "material": "",
                                "fun": "",
                                "comprehensibility": "",
                                "interesting": "",
                                "grade_effort": "",
                            },
                        }

                    # append the processed course to the list
                    processed_courses.append(processed_course)
                    pp.pprint(processed_course)

                # calculate the average rating
                for key, item in avg_ratings.items():
                    avg_ratings[key] = item / ratings_count  # type: ignore

                ratings_file.close()
                with open(
                    E3_COURSES_DATA_FILE, "w", encoding="utf-8"
                ) as output_course_file:
                    json.dump(processed_courses, output_course_file, ensure_ascii=False)
                    output_course_file.close()
            courses_file.close()
        # os.unlink(E3_COURSE_CATALOG_DATA_FILE)
        # os.unlink(POSTPROCESSED_E3_RATING_DATA_FILE)
