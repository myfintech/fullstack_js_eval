## Question:
*Please describe how the database schema might be improved in terms of cost/trade-off by using a join table between the `people` and `addresses` table.*

## Answer:
By joining the two tables together, a single query would be used to gather data rather than querying through multiple tables. Joining the two tables together before querying would be more efficient so long as the join is executed properly and indexes are all correct.

While querying two tables is not significantly more expensive than querying one, in more complex scenarios where 3+ tables are linked together it will be much more efficient to first join the tables then perform the queries rather than individually query through each table one at a time.