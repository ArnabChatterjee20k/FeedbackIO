from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
from appwrite.exception import AppwriteException

def update_landing_page(client: Client, db_id: str, landing_page_col_id: str, space_id: str, new_logo_url: str):
    db = Databases(client)
    docs = {
        "logo": new_logo_url,
    }
    try:
        result = db.update_document(db_id, landing_page_col_id, space_id, docs)
        return result
    except AppwriteException as e:
        raise Exception(f"Failed to update landing page: {str(e)}")

def update_space(client: Client, db_id: str, space_col_id: str, space_id: str, new_logo_id: str, new_logo_url: str):
    db = Databases(client)
    docs = {
        "logo": new_logo_url,
        "fileId": new_logo_id
    }
    try:
        result = db.update_document(db_id, space_col_id, space_id, docs)
        return result
    except AppwriteException as e:
        raise Exception(f"Failed to update space: {str(e)}")

def get_space(client: Client, db_id: str, space_col_id: str, space_id: str):
    db = Databases(client)
    try:
        space = db.get_document(db_id, space_col_id, space_id)
        return space
    except AppwriteException as e:
        raise Exception(f"Failed to get space: {str(e)}")
    
def delete_old_file(client,bucket_id,file_id:str):
    bucket = Storage(client)
    bucket.delete_file(bucket_id,file_id)