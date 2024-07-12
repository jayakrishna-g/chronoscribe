from google.cloud import storage
import os
import uuid


async def upload_to_gcp(file, bucket_name,room_id):
    client = storage.Client()
    bucket = client.get_bucket(bucket_name)
    new_filename = f"{uuid.uuid4()}_{room_id}"
    blob = bucket.blob(new_filename)
    blob.upload_from_file(file.file)
    return f"https://storage.googleapis.com/{bucket_name}/{new_filename}"