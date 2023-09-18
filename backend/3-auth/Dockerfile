# syntax=docker/dockerfile:1.6
FROM python:3.11-slim AS python

# Install dependencies
ENV BUILD_DEPS "build-essential pkg-config libpq-dev"
RUN --mount=type=cache,sharing=private,target=/var/cache/apt \
    --mount=type=cache,sharing=private,target=/var/lib/apt <<EOF
  rm -f /etc/apt/apt.conf.d/docker-clean
  echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
  DEBIAN_FRONTEND=noninteractive apt-get update -q &&
  apt-get install -qq --no-install-recommends -o=Dpkg::Use-Pty=0 $BUILD_DEPS
EOF

# Set up application user and directories
RUN adduser --disabled-login --gecos "" -u 1000 app
USER 1000
WORKDIR /home/app

# Configure Python environment
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIPENV_VENV_IN_PROJECT 1
ENV PIPENV_VERBOSITY -1
ENV VIRTUAL_ENV=/home/app/.venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install Python dependencies
COPY --chown=app:app Pipfile* .
RUN  --mount=type=cache,sharing=private,target=/home/app/.cache/pip,uid=1000 \
     --mount=type=cache,sharing=private,target=/home/app/.cache/pipenv,uid=1000 <<EOF
  pip install --no-color pipenv gunicorn &&
  pipenv install --deploy
EOF

# Clean up build dependencies
USER root
RUN  apt-get purge -y --auto-remove $BUILD_DEPS
USER 1000

# Add application and run setup tasks
COPY --chown=app:app . ./

# Run web application
ENV GUNICORN_LOG_LEVEL info
EXPOSE 8001
CMD ["bin/web"]
