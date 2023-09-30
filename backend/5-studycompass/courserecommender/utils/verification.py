import re
import wikipediaapi
from sentence_transformers import SentenceTransformer
from courserecommender.models import *


def verify_keyword():
    embedding_model = SentenceTransformer(
        "paraphrase-multilingual-MiniLM-L12-v2")
    wiki = wikipediaapi.Wikipedia('MyProjectName (merlin@example.com)', "en")
    # keyword_list = Keyword.nodes.all()
    keyword_list = Keyword.nodes.filter(verified=False)
    print("{} keyword nodes need to be verified".format(len(keyword_list)))
    for keyword in keyword_list:
        try:
            wiki_article = wiki.page(keyword.name)
            if wiki_article.exists():
                print(keyword.name)
                verified_name = wiki_article.title
                summary = re.sub(r"may refer to:", "",
                                 wiki_article.summary, count=1)
                embedding = embedding_model.encode(
                    wiki_article.summary).tolist()
                url = wiki_article.fullurl
                if not Topic.nodes.get_or_none(name=verified_name):
                    topic = Topic(
                        name=verified_name,
                        summary=summary,
                        url=url,
                        embedding=embedding,
                    )
                    topic.save()
                else:
                    topic = Topic.nodes.get(name=verified_name)
                keyword.map.connect(topic)
                keyword.verified = True
                keyword.save()
            else:
                keyword.delete()
        except Exception as e:
            print("verification error", e)
