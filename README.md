### Running the app locally
1. Storage -> Make sure to add permission for both the any and all user
### Decisions
1. Creating separate schemas for each instead of clubbing them together.
    Pros - Collection level query will be fast
    Cons - Insertion will be heavy during the creation of space as collection is populated by default data.

    But since pages will be served individually to client, so that will be fast.

2. Saving space and saving pages in waterfall manner instead of doing concurrently while saving default data during creation of space