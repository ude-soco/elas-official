# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


class E3CourseCatalogPipeline:
    def process_item(self, item, spider):
        # remove unwanted symbols
        if len(item["name"].split("\n")) >= 2:
            item["name"] = str(item["name"]).split("\n")[1].strip(" ")
        return item
