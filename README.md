# Junior Backend Developer Assessment

Node.js app: /user_reg/server.js

Postman: /user_reg/test/postman_collection.json

APIs:

1. /api/register

2. /api/login

3. /api/actions/changepassword

4. /api/profiles

Notes / Assumptions:

1. username is unique; validation applied

2. email is unique; validation applied

3. For security reason, hashed passwords will be stored

4. Login token will be valid for 24 hours

5. For security reason, same error message will be shown for wrong username / password

# Senior Backend Developer Assessment

Node.js app: /student_reg/server.js

Postman: /student_reg/test/postman_collection.json

APIs:

1. /api/register

2. /api/commonstudents

3. /api/suspend

4. /api/retrievefornotifications

Notes / Assumptions:

1. Duplicated teacher / student registration will be ignored

2. Aligned all the sample email addresses to @example.com (instead of @gmail.com) for testing

3. Below regular expression applied for retrieving mentioned students from notifications

	/(@[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
