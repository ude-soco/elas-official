import io
import json
import os

E3_RATING_DATA_FILE = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "e3_course_ratings.json")
)

POSTPROCESSED_E3_RATING_DATA_FILE = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "data",
        "post_processed_e3_course_ratings.json",
    )
)


class ProcessE3CourseRatings:
    # clean the destination directory before filling it with new data
    def clear_output_directories(self):
        open(POSTPROCESSED_E3_RATING_DATA_FILE, "w").close()

    def run(self):
        self.clear_output_directories()
        with io.open(E3_RATING_DATA_FILE, encoding="utf8") as json_file:
            data = json.load(json_file)
            for subject in data:
                attribute_dict = {
                    "fairness": [],
                    "support": [],
                    "material": [],
                    "fun": [],
                    "understandability": [],
                    "interest": [],
                    "node_effort": [],
                    "recommendation": [],
                }

                for rating in subject["ratings"]:
                    for attrib in attribute_dict:
                        try:
                            value = rating[attrib]
                            if value is not None:
                                if attrib == "recommendation":
                                    if str(value).lower() == "ja":
                                        value = 5
                                    else:
                                        value = 0

                                # normalize and add value: value range between 0 - 5
                                attribute_dict[attrib].append(float(value) * 100 / 5)
                        except:
                            # do nothing
                            print(attrib)

                # add stats to course
                for attrib in attribute_dict:
                    if len(attribute_dict[attrib]) != 0:
                        subject[attrib] = sum(attribute_dict[attrib]) / len(
                            attribute_dict[attrib]
                        )
                    else:
                        subject[attrib] = None

            with open(POSTPROCESSED_E3_RATING_DATA_FILE, "w") as output_file:
                json.dump(data, output_file, ensure_ascii=False)
                output_file.close()
            json_file.close()
        # os.unlink(E3_RATING_DATA_FILE)
