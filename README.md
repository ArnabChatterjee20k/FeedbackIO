### Running the app locally
1. Storage -> Make sure to add permission for both the any and all user
2. Run either the script(if you wanna husstle that I did) or you can use the appwrite cli and the appwrite json file.
```bash
appwrite pull
appwrite push <element>
```
3. For events also use the json file
4. For identifying any elment like db or collections use the key instead of the literal. Example don't write databases.space rather databases.<space_Id>

5. For functions follow this https://appwrite.io/docs/products/functions/develop#request
6. Also paste the env in the fuction environt variables
### Decisions
1. Creating separate schemas for each instead of clubbing them together.
    Pros - Collection level query will be fast
    Cons - Insertion will be heavy during the creation of space as collection is populated by default data.

    But since pages will be served individually to client, so that will be fast.

    Also every page is one-one mapped to space to uniquely query by space_id and update them

2. Appwrite functions are written in python cause why not its my favourite language and I want to explore the sdks to the utmost.

3. The ssr/bff code is written and managed using node-appwrite and nextjs

4. The function delete-image will be running twice.
The space updated in the backend (in newFiles field) to track whether image was changed or not.
Now during the execution of the function we are updating once more
But the second one will not be highly expensive as it already ran. The check is important

Can be solved using an external queue/collection updation.
Queue col updated -> function for updating space,landingpage and deleting old file
> Image change is unlikely to happen most of the time