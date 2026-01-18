FROM python:3.11-alpine

# Set working directory
WORKDIR /app

# Copy requirements and install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy rest of the app
COPY . .

# Expose port for Flask
EXPOSE 5000

CMD ["python", "quiz_server.py"]
