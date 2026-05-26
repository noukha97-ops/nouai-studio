# Hloov mus siv RunPod lub base image
FROM runpod/pytorch:2.2.0-py3.10

WORKDIR /app

# Tshem .git directory thiab lwm yam tsis tsim nyog thaum copy
# Yog koj muaj .dockerignore, nco ntsoov ntxiv .git rau hauv ntawd
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Tsuas copy cov file uas yuav tsum siv xwb
COPY handler.py .
# Yog koj muaj lwm yam code, ntxiv cov kab no:
# COPY model_utils.py .

CMD ["python", "handler.py"]
