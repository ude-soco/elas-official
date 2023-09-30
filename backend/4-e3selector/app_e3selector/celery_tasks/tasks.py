import os
from celery import shared_task

from .scrape_e3 import scrape_e3_data, scrape_e3_ratings
from .postprocess_e3_ratings import ProcessE3CourseRatings
from .postprocess_e3_merge import ProcessMergeE3CoursesAndRatings
from .uploader_e3 import E3Uploader


@shared_task()
def scrape_e3_task(url):
    scrape_e3_data(url)
    scrape_e3_ratings()

    e3_course_rating_processing = ProcessE3CourseRatings()
    e3_course_rating_processing.run()

    e3_course_rating_merging = ProcessMergeE3CoursesAndRatings()
    e3_course_rating_merging.run()

    e3_uploader = E3Uploader()
    e3_uploader.run()

    return "E3 data scraping completed"
