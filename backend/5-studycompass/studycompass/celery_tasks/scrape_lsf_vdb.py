import os
import subprocess
import shutil


lsf_scraper_directory = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "lsf_scraper")
)
lsf_data_directory = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "lecture_results.json")
)


def scrape_lsf_data(url):
    cmd = f'scrapy crawl lsf_scraper -a url="{url}" -o lecture_results.json'
    result = subprocess.run(cmd, cwd=lsf_scraper_directory, shell=True, check=True)
    lecture_results = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__), "..", "lsf_scraper", "lecture_results.json"
        )
    )

    # Clear the content of the lecture_results.json file
    with open(lsf_data_directory, "w") as file:
        file.truncate()

    # Copy the content of the temporary file to lecture_results.json
    shutil.copy(lecture_results, lsf_data_directory)

    # Delete the temporary file
    os.unlink(lecture_results)


vdb_scraper_directory = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "vdb_scraper")
)
vdb_data_directory = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "description_results.json")
)


def scrape_vdb_data():
    cmd = f"scrapy crawl lsf_scraper -a -o description_results.json"
    result = subprocess.run(cmd, cwd=vdb_scraper_directory, shell=True, check=True)
    vdb_results = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__), "..", "vdb_scraper", "description_results.json"
        )
    )

    with open(vdb_data_directory, "w") as file:
        file.truncate()

    shutil.copy(vdb_results, vdb_data_directory)
    os.unlink(vdb_results)
