from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
from appwrite.exception import AppwriteException
import os
from .utils import update_landing_page,update_space,delete_old_file,get_space

def main(context):
    client = (
        Client()
        .set_endpoint(os.environ["APPWRITE_FUNCTION_API_ENDPOINT"])
        .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
        .set_key(context.req.headers["x-appwrite-key"])
    )
    # extracting the props
    error = context.error
    log = context.log
    req = context.req
    res = context.res

    body = req.body
    log("Full request body:")
    log(body)
    log("Body keys:")
    log(body.keys())
    
    old_file_id = body.get("fileId")
    new_file_id = body.get("newFileId")
    new_file_url = body.get("newFileURL")
    
    log(f"old_file_id: {old_file_id}")
    log(f"new_file_id: {new_file_id}")
    log(f"new_file_url: {new_file_url}")
    
    space_doc_id = body.get("$id")
    space_col_id = body.get("$collectionId")
    db_id = body.get("$databaseId")
    bucket_id = os.environ.get("BUCKET_ID")
    landing_page_col_id = os.environ.get("LANDING_PAGE_COL_ID")
    
    space = get_space(client, db_id, space_col_id, space_doc_id)
    if space:
        log("Current space data:")
        log(space)
        
        # Modified condition to check only necessary fields
        is_cur_space_logo_updated = new_file_id and new_file_url and new_file_id != space.get("fileId")
        log(f"Logo update needed: {is_cur_space_logo_updated}")
        
        if is_cur_space_logo_updated:
            try:
                # Update space first
                update_space(client, 
                    db_id=db_id,
                    space_col_id=space_col_id,
                    new_logo_id=new_file_id,
                    new_logo_url=new_file_url,
                    space_id=space_doc_id)
                log("Space updated successfully")
                
                # Update landing page
                update_landing_page(client,
                    db_id=db_id,
                    space_id=space_doc_id,
                    landing_page_col_id=landing_page_col_id,
                    new_logo_url=new_file_url)
                log("Landing page updated successfully")
                
                # Delete old file
                if old_file_id:
                    delete_old_file(client, bucket_id=bucket_id, file_id=old_file_id)
                    log("Old file deleted successfully")
                
                return res.text("Synced", 200)
            except Exception as e:
                error(f"Error occurred: {str(e)}")
                return res.text(f"Error occurred: {str(e)}", 500)
        
        return res.text("Space logo not updated - no changes needed", 200)
    return res.text("Space not found", 404)