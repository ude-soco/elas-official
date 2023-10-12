import os
from celery import shared_task

from .scrape_lsf_vdb import scrape_lsf_data, scrape_vdb_data
from .postprocess_lsf import ProcessLsfData
from .postprocess_vdb import ProcessVdbData
from .postprocess_merge import ProcessMergeData
from .uploader_lsf_vdb import LSFVDBUploader
from .uploader_graph import KGBuilder

lsf_scraper_directory = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "lsf_scraper")
)
lsf_data_directory = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..",
                 "data", "lecture_results.json")
)


@shared_task()
def scrape_lsf_task(url):
    scrape_lsf_data(url)
    # scrape_vdb_data() # TODO: Uncomment this line when the VDB website is ready

    lsf_data_processing = ProcessLsfData()
    lsf_data_processing.run()

    # vdb_data_processing = ProcessVdbData()
    # vdb_data_processing.run()

    merge_lsf_vdb = ProcessMergeData()
    merge_lsf_vdb.run()

    # upload_lsf_vdb = LSFVDBUploader()
    # upload_lsf_vdb.upload_data()

    build = KGBuilder()
    build.run()

    return "LSF data scraping and KG building completed"
