import json
from django.contrib.auth.hashers import check_password
from django.db.utils import IntegrityError
from django.http import JsonResponse
from django.utils import timezone
import requests
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import (
    OutstandingToken,
    BlacklistedToken,
)

from server.eureka_service import get_service_url

# from courserecommender.models.student import Student

from ..serializers import UserRegistrationSerializer, UserLoginSerializer
from ..models import *


@api_view(["POST"])
@permission_classes([AllowAny])
def user_registration_view(request):
    data = JSONParser().parse(request)
    serializer = UserRegistrationSerializer(data=data)
    if serializer.is_valid():
        # user = User(**serializer.validated_data)
        try:
            user = serializer.save()
        except IntegrityError as e:
            if "username" in str(e):
                return JsonResponse(
                    {"error": "Username already exists"},
                    status=status.HTTP_409_CONFLICT,
                )
            elif "email" in str(e):
                return JsonResponse(
                    {"error": "Email already exists"}, status=status.HTTP_409_CONFLICT
                )
            else:
                return JsonResponse(
                    {"error": "An unknown unique constraint violation occurred"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return JsonResponse(
            {"message": "User registered successfully"}, status=status.HTTP_201_CREATED
        )
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def user_login_view(request):
    data = JSONParser().parse(request)
    serializer = UserLoginSerializer(data=data)
    if serializer.is_valid():
        username = serializer.validated_data.get("username")
        password = serializer.validated_data.get("password")
        user = User.objects.filter(username=username).first()

        if user and check_password(password, user.password):
            # TODO: Need to add the request to courserecommender app
            if not user.is_staff or not user.is_superuser:  # type: ignore
                service_url = get_service_url("ELAS-STUDYCOMPASS")
                student_data = requests.get(
                    f"{service_url}/api/course-recommender/get-student/",
                    json={"uid": str(user.id)},
                )
                student = json.loads(student_data.text)
            user.last_login = timezone.now()
            user.save()
            refresh = RefreshToken.for_user(user)  # type: ignore
            if not user.is_staff or not user.is_superuser:
                return JsonResponse(
                    {
                        "user": {
                            "id": user.id,
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                            "username": user.username,
                            "email": user.email,
                            "study_program": student["study_program"],  # type: ignore
                            "start_semester": student["start_semester"],  # type: ignore
                        },
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return JsonResponse(
                    {
                        "user": {
                            "id": user.id,
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                            "username": user.username,
                            "email": user.email,
                            "is_staff": user.is_staff,
                        },
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return JsonResponse(
                {
                    "error": "Authentication failed. Please check your username and password.",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def user_logout_view(request):
    data = JSONParser().parse(request)
    refresh_token = data.get("refresh")
    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            outstanding_token = OutstandingToken.objects.filter(token=token).first()
            if outstanding_token:
                blacklisted_token = BlacklistedToken(token=outstanding_token)
                blacklisted_token.save()
                return JsonResponse(
                    {"message": "User logged out successfully"},
                    status=status.HTTP_200_OK,
                )
            else:
                return JsonResponse(
                    {"error": "Token not found"}, status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse(
            {"error": "Refresh token not provided"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def user_update_view(request, user_id):
    user = User.objects.filter(id=user_id).first()
    if user is None:
        return JsonResponse(
            {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
        )

    data = JSONParser().parse(request)
    serializer = UserRegistrationSerializer(user, data=data, partial=True)
    if serializer.is_valid():
        try:
            updated_user = serializer.save()
        except IntegrityError as e:
            if "username" in str(e):
                return JsonResponse(
                    {"error": "Username already exists"},
                    status=status.HTTP_409_CONFLICT,
                )
            elif "email" in str(e):
                return JsonResponse(
                    {"error": "Email already exists"}, status=status.HTTP_409_CONFLICT
                )
            else:
                return JsonResponse(
                    {"error": "An unknown unique constraint violation occurred"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return JsonResponse(
            {"message": "User updated successfully"}, status=status.HTTP_200_OK
        )
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Testing authentication: SUCCESS
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def session_view(request):
    return JsonResponse({"message": "Session is active"}, status=status.HTTP_200_OK)
