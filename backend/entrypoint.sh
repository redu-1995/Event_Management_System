#!/bin/sh

set -e

echo "Running database migrations..."
python manage.py migrate --noinput

# --- UPDATE THIS BLOCK IN YOUR entrypoint.sh ---
echo "Creating superuser if it doesn't exist..."
python -c "
import os
import django

# Tell Django where your settings file is (core is your project folder name)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'DefaultPassword123!')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print('Superuser created successfully!')
else:
    print('Superuser already exists.')
"
# ------------------------------------------------

exec "$@"