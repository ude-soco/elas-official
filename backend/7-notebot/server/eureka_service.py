from py_eureka_client import eureka_client


def get_service_url(service_name):
    client = eureka_client.get_client()
    application = client.applications.get_application(service_name)
    if application:
        instance = application.up_instances[0]
        return f"http://{instance.hostName}:{instance.port.port}"
    else:
        return None
