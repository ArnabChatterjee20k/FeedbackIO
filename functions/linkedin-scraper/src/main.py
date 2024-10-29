from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.exception import AppwriteException
import os
from .utils import scrape
def main(context):
    client = (
        Client()
        .set_endpoint(os.environ["APPWRITE_FUNCTION_API_ENDPOINT"])
        .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
        .set_key(context.req.headers["x-appwrite-key"])
    )
    body = context.req.body
    doc_id = body.get("$id")
    col_id = body.get("$collectionId")
    db_id = body.get("$databaseId")

    social_type = body.get("type")
    url = body.get("url")
    # currently running linkedin here only as twitter is running only through triggerdotdev
    try:
        if social_type == "linkedin":
            data = scrape(url)
            content = data.get("content")
            name = data.get("name")
            profile_picture = data.get("profile_picture")
            tag = data.get("profile_info")

            db = Databases(client)
            db.update_document(db_id,col_id,doc_id,{"content":content,"name":name,"userProfilePicture":profile_picture,"tag":tag})
            context.log("completed")
        else:
            context.log("not linkedin")
    except AppwriteException as err:
        context.error("Some error occured: " + repr(err))

    return context.res.json(
        {
            "success":True
        }
    )
