import numpy as np
from numpy.linalg import norm


def cosine_similarity(a, b):
    # Calculates the cosine similarity between two numpy arrays
    dot_product = np.dot(a, b)
    norm_a = norm(a)
    norm_b = norm(b)
    return dot_product / (norm_a * norm_b)


def get_similar_students(student, candidate_similar_list):
    similarity_list = []
    try:
        s_embedding = np.array(student.embedding)
        for user in candidate_similar_list:
            if user != student:
                if len(user.embedding) > 1:
                    u_embedding = np.array(user.embedding)
                    similarity = cosine_similarity(s_embedding, u_embedding)
                    similarity_list.append(
                        {"name": user.username, "similarity": similarity}
                    )
        sorted_similarity_list = sorted(
            similarity_list, key=lambda x: x["similarity"], reverse=True
        )
        top_5_similar = sorted_similarity_list[:5]
        return top_5_similar
    except Exception as e:
        print(e)


# def get_similar_students(student, candidate_similar_list):
#     similarity_list = []
#     try:
#         s_embedding = np.array(student.embedding)
#         # for user in candidate_similar_list:
#         for node_list in candidate_similar_list:
#             user = node_list[0]
#             if user != student:
#                 if user["embedding"]:
#                     u_embedding = np.array(user["embedding"])
#                     similarity = cosine_similarity(s_embedding, u_embedding)
#                     print(similarity)
#                     similarity_list.append(
#                         {"name": user["username"], "similarity": similarity})
#         sorted_similarity_list = sorted(
#             similarity_list, key=lambda x: x["similarity"], reverse=True)
#         top_5_similar = sorted_similarity_list[:4]
#         return top_5_similar
#     except Exception as e:
#         print(e)
