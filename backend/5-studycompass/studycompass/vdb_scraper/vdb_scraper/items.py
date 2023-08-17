# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class VdbScraperItem(scrapy.Item):
    # define the fields for your item here like:
    name = scrapy.Field()
    url = scrapy.Field()
    id = scrapy.Field()
    type = scrapy.Field()  # StudyCourse, Lecture


class StudyCourse(VdbScraperItem):
    pass


class Lecture(VdbScraperItem):
    parent_course = scrapy.Field()  # which study course lecture belongs to
    description = scrapy.Field()
