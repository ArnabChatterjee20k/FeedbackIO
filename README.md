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

### Implementing SSO and extending it
1. Basically for auth required spaces , we need to authenticate users
2. So if server is telling the widget is not authenticated then widget is redicting to `/api/identity?next=<redirectURI>` endpoint
3. Here searchParams next is telling the redirect uri
4. Then at /api/identity we are authenticating the user with oauth by getting creating a redirect oauth url using appwrite and redirecting it to that generated url. Now here we are provide success url(if google is authentication is succesfull) and failure case which is redirection to the original site
5. In success case, we are redirecting again /identity/oauth?next=<>&userId=<>&secret=<> . Here we are creating the session.
6. Then again redirecting to the ?next site with token search param. http//nextsite?token=<> which can be a frontend or the backend
7. In the frontend, the client is reading the token and saving it to the local storage. And with every request to the /api/feedback the token is sent to authenticate and accordinly settings are sent.
8. If we want them to automatically get logged at the feedbackso main site, then we can set the cookie before redirection to the next site like we are doing in the main app.

### Why not appwrite-functions for scraping service?
I started with this only cause it's simple. Events published -> scrapers consumed -> operation -> updated
But appwrite function literally didn't work for scrapers may be due to the level abstraction it is running on. Headless browsers drivers not found and custom downloading script also failed to download them during the runtime. Even if downloaded path issues are coming.
I trited the approach I did in vercel functions by downloading custom binaries to mitigate  size of functions but it also failed.
So going with trigger dot dev for running workers.
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

### Improvements
1. Currently all pages and routes are totally dynamic and no caching getting done. So can be cached
2. By using a domain, we can use apex domains to serve personalised pages
3. Polls creation , form creation ,etc