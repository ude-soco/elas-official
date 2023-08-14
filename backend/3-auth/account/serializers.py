import json
import os
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from typing import Dict, Any

from .models import User
# from courserecommender.models import Student

semester_directory = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__), "..", "courserecommender", "data", "semester.json"
    )
)


class UserRegistrationSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    username = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    study_program = serializers.CharField(max_length=240)
    start_semester = serializers.CharField(max_length=30)

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

        # TODO: Need to add the request to courserecommender app to create a student node
        # with open(semester_directory) as f:
        #     semester_data = json.load(f)

        # student_data = {
        #     "uid": str(user.id),
        #     "name": validated_data["username"],
        #     "study_program": validated_data["study_program"],
        #     "start_semester": validated_data["start_semester"],
        #     "current_semester": semester_data[-1]["name"],
        # }
        # try:
        #     student = Student(**student_data)
        #     student.save()
        # except Exception as e:
        #     print(f"Error creating student node: {e}")

        return user

    def update(self, user, validated_data):
        user_fields = ["first_name", "last_name", "username", "email", "password"]
        student_fields = ["name", "study_program", "start_semester"]

        for field in user_fields:
            if field in validated_data:
                setattr(user, field, validated_data[field])
        user.save()

        # TODO: Need to add the request to courserecommender app to update a student node
        # student = Student.nodes.get(uid=user.id)

        # student_updated = False
        # for field in student_fields:
        #     if field == "name":
        #         setattr(student, field, validated_data["username"])
        #         student_updated = True
        #     if field in validated_data:
        #         setattr(student, field, validated_data[field])
        #         student_updated = True

        # if student_updated:
        #     student.save()

        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    validated_data: Dict[str, Any]
