# Backend Dockerfile

# Python image
FROM python:3.9-slim

# Upgrade pip
RUN pip install --upgrade pip

# Install tesseract
RUN apt-get update && \
    apt-get install -y tesseract-ocr libtesseract-dev

# Copy the train data into the tessdata directory of tesseract
COPY ./tesseract_data/ /usr/share/tesseract-ocr/5/tessdata/

# Work directory
WORKDIR /app

# Copy dependencies file
COPY requirements.txt /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . /app

# Expose port
EXPOSE 8000

# Execute app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]