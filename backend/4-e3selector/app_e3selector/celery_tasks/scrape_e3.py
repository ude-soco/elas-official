import os
import subprocess
import shutil


e3_scraper_directory = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "e3_course_catalog")
)
e3_data_directory = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "e3_course_catalog.json")
)


def scrape_e3_data(url):
    cmd = f'scrapy crawl e3_course_catalog -a url="{url}" -a e3=True -o e3_course_catalog.json'
    result = subprocess.run(cmd, cwd=e3_scraper_directory, shell=True, check=True)
    e3_course_catalog_results = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "e3_course_catalog",
            "e3_course_catalog.json",
        )
    )

    with open(e3_data_directory, "w") as file:
        file.truncate()

    shutil.copy(e3_course_catalog_results, e3_data_directory)
    os.unlink(e3_course_catalog_results)


e3_course_ratings_directory = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "e3_course_ratings")
)
e3_course_ratings_data_directory = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "e3_course_ratings.json")
)

ratingsEmail = "nefapiw920@yeafam.com"
ratingsPassword = "bachelor_thesis"


def scrape_e3_ratings():
    cmd = f'scrapy crawl e3_course_ratings -a email="{ratingsEmail}" -a password="{ratingsPassword}" -o e3_course_ratings.json'
    result = subprocess.run(
        cmd, cwd=e3_course_ratings_directory, shell=True, check=True
    )
    e3_course_ratings_directory_results = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "e3_course_ratings",
            "e3_course_ratings.json",
        )
    )

    with open(e3_course_ratings_data_directory, "w") as file:
        file.truncate()

    shutil.copy(e3_course_ratings_directory_results, e3_course_ratings_data_directory)
    os.unlink(e3_course_ratings_directory_results)
