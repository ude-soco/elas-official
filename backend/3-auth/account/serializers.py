import requests
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from typing import Dict, Any

from server.eureka_service import get_service_url

from .models import User


class UserRegistrationSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    username = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    study_program = serializers.CharField(max_length=240, required=False)
    start_semester = serializers.CharField(max_length=30, required=False)

    # TODO: Need to add the confirm password implementation

    validated_data: Dict[str, Any]

    def create(self, validated_data):
        user_data = {
            k: validated_data[k]
            for k in ("first_name", "last_name", "username", "email")
        }
        user_data["password"] = make_password(validated_data["password"])
        user = User(**user_data)
        user.save()

        try:
            payload = {
                "uid": str(user.id),
                "name": f"{validated_data['first_name']} {validated_data['last_name']}",
                "username": validated_data["username"],
                "study_program": validated_data.get("study_program", ""),
                "start_semester": validated_data.get("start_semester", ""),
            }
            service_url = get_service_url("ELAS-STUDYCOMPASS")
            requests.post(
                f"{service_url}/api/course-recommender/new-student/", json=payload
            )
        except Exception as e:
            print(f"Error creating student node: {e}")

        return user

    def update(self, user, validated_data):
        user_fields = ["first_name", "last_name", "username", "email", "password"]

        for field in user_fields:
            if field in validated_data:
                setattr(user, field, validated_data[field])
        user.save()  # TODO: Check whether it is saving twice

        try:
            payload = {
                "uid": str(user.id),
                "name": f"{validated_data['first_name']} {validated_data['last_name']}",
                "username": validated_data["username"],
                "study_program": validated_data.get("study_program", ""),
                "start_semester": validated_data.get("start_semester", ""),
            }
            service_url = get_service_url("ELAS-STUDYCOMPASS")
            requests.put(
                f"{service_url}/api/course-recommender/update-student/", json=payload
            )
        except Exception as e:
            print(f"Error creating student node: {e}")

        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    validated_data: Dict[str, Any]
