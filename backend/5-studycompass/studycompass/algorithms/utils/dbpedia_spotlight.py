import requests
from SPARQLWrapper import SPARQLWrapper, JSON


class DBpediaSpotlight:
    def __init__(self, lang="en"):
        self.url = "https://api.dbpedia-spotlight.org/%s/annotate" % lang
        self.sparql = SPARQLWrapper("http://dbpedia.org/sparql")
        self.sparql.setTimeout(60)

    def _get_wikipedia_abstract(self, title):
        url = "https://en.wikipedia.org/w/api.php"
        params = {
            "action": "query",
            "format": "json",
            "titles": title,
            "prop": "extracts",
            "exintro": True,
            "explaintext": True,
        }
        response = requests.get(url, params=params)
        data = response.json()
        page = next(iter(data["query"]["pages"].values()))
        wikipedia_url = f"https://en.wikipedia.org/?curid={page['pageid']}"
        abstract = page["extract"]
        return wikipedia_url, abstract

    def annotate(self, keyword):
        annotations = []
        try:
            params = {"text": keyword, "confidence": 0.35, "support": 5}
            headers = {"Accept": "application/json"}
            response = requests.get(
                self.url, headers=headers, params=params, verify=True
            ).json()

            if "Resources" in response:
                resources = response["Resources"]

                for resource in resources:
                    label = self._get_label(resource["@URI"])

                    if label != "":
                        wiki_url, wiki_abstract = self._get_wikipedia_abstract(label)
                        annotation = {
                            # "id": abs(hash(resource["@URI"])),
                            "keyword": keyword,
                            "verified_keyword": label,
                            "abstract": wiki_abstract,
                            "url": wiki_url,
                            "similarity": resource["@similarityScore"],
                        }
                        if not self._exists(annotation, annotations):
                            annotations.append(annotation)

        except Exception as e:
            print(e)

        return annotations

    def _get_label(self, uri):
        """ """
        label = ""
        try:
            # Getting rdfs:label from @URI object from dbpedia annotate API
            query = (
                """
                SELECT ?label
                FROM <http://dbpedia.org>
                WHERE {
                    <%s> rdfs:label ?label .
                    FILTER (lang(?label) = 'en')
                }
            """
                % uri
            )

            self.sparql.setQuery(query)
            self.sparql.setReturnFormat(JSON)
            results = self.sparql.query().convert()
            # return results
            label = results["results"]["bindings"][0]["label"]["value"]  # type: ignore

        except Exception:
            pass
        return label

    def _exists(self, node, nodes):
        return any(node["id"] == _node["id"] for _node in nodes)
