body = {"name":"hello world","userId":"670ba3fa407117ca3ad9","logo":"https://cloud.appwrite.io/v1/storage/buckets/6713c0e90037b15a3678/files/671a2e900004d0693e22/preview?project=6709575d003c42d207ba&project=6709575d003c42d207ba","fileId":"671a2e900004d0693e22","newFileId":"671a338b0034e26d9e2b","newFileURL":"https://cloud.appwrite.io/v1/storage/buckets/6713c0e90037b15a3678/files/671a338b0034e26d9e2b/preview?project=6709575d003c42d207ba&project=6709575d003c42d207ba","$id":"671a2e92000e7713cdea","$createdAt":"2024-10-24T11:25:06.660+00:00","$updatedAt":"2024-10-24T11:46:21.577+00:00","$permissions":["read(\"user:670ba3fa407117ca3ad9\")","update(\"user:670ba3fa407117ca3ad9\")","delete(\"user:670ba3fa407117ca3ad9\")"],"$databaseId":"670f600400337e01d085","$collectionId":"6712b1c0002c31c0703a"}

file_id = body.get("newFileId")
new_file_url = body.get("new_file_url")
print(file_id,new_file_url)    
