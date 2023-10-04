from courserecommender.models import *
from sentence_transformers import SentenceTransformer
import numpy as np


def has_keyword_To_has_topic():
    print("mapping has_keyword to has_topic")
    # instance_list = Course_instance.nodes.all()
    instance_list = Course_instance.nodes.filter(embedding__isnull=True)
    print("{} course instance nodes be linked to topic".format(len(instance_list)))
    try:
        for instance_node in instance_list:
            # get all topic nodes linked with instance_node
            keyword_list = instance_node.keyword.all()
            for keyword_node in keyword_list:
                # match keyword relation
                keyword_rel = instance_node.keyword.relationship(keyword_node)
                # get topic linked with keyword_node
                topic_node = keyword_node.map.single()
                if not keyword_rel.mapped == True:
                    if instance_node.topic.is_connected(topic_node):
                        topic_rel = instance_node.topic.relationship(topic_node)
                        new_weight = keyword_rel.weight + topic_rel.weight
                        topic_rel.weight = new_weight
                        topic_rel.save()
                        print(topic_node.name)
                        print(new_weight)
                    else:
                        instance_node.topic.connect(
                            topic_node, {"weight": keyword_rel.weight}
                        )
                    keyword_rel.mapped = True
                    keyword_rel.save()
    except Exception as e:
        print("mapping edges error", e)


def normalize_has_topic():
    print("normalizing has_topic and calculate instance embedding")
    # instance_list = Course_instance.nodes.all()
    instance_list = Course_instance.nodes.filter(embedding__isnull=True)
    embedding_model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
    print("{} course instance nodes calculate embedding".format(len(instance_list)))
    try:
        for instance_node in instance_list:
            # get all topic nodes linked with instance_node
            topic_list = instance_node.topic.all()
            weight_sum = 0
            instance_embedding = np.array([0])
            if not len(topic_list) == 0:
                for topic_node in topic_list:
                    topic_rel = instance_node.topic.relationship(topic_node)
                    weight_sum += topic_rel.weight
                for topic_node in topic_list:
                    topic_rel = instance_node.topic.relationship(topic_node)
                    normalized_weight = topic_rel.weight / weight_sum
                    topic_rel.normalized_weight = normalized_weight
                    topic_rel.save()

                    # calculate course instance embedding, weighted avg of topics
                    topic_embedding = np.array(topic_node.embedding)
                    instance_embedding = (
                        instance_embedding + normalized_weight * topic_embedding
                    )
                    instance_node.embedding = instance_embedding
                    instance_node.save()
            # if no topic(no keyword), use course name for embedding
            else:
                instance_node.embedding = embedding_model.encode(
                    instance_node.name
                ).tolist()
                instance_node.save()
    except Exception as e:
        print("normalization error", e)
