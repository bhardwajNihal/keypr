

Todos : 

1. Next project setup✅
2. clerk setup✅
3. auth workflow, dynamic navbar✅
4. rough dashboard skeleton✅
5. adding tabs for cards, passwords, secret phrases✅

// backend setup
    1. mongoose, bcrypt, zod installation✅
    2. add project document to mongo, add connection string to .env✅
    2. defining DB connection instance.✅
    3. defining models for - 
        i. security pin ✅
        ii. card details✅
        iii. password details✅
        iv. secrete phrases✅

    4. Backend route for :

** No manual auth middleware, the session verification is managed the clerk right out of the box.
    Clerk stores session as a secure HttpOnly cookie
    This cookie is automatically included in every request from your frontend
    Clerk's server SDK (auth()) reads & validates this behind the scenes
    >> just using the method ==> const {userId} = auth() --> provided by clerk

      |  i. adding
      |  - pin✅     (hashing is enough)
      |  - card details ✅       (needs encryption-decryption)
      |  - password details✅    (needs encryption-decryption)
      |  - secret phrases✅      (needs encryption-decryption)

# NOTE: For the sensitive info that needs back to be shown to the user, hashing isn't enough.
- we have to encrypt it before saving it the db, and dcrypt only if certain criteria is fulfilled to make is safe. (i.e. user must be logged in and have entered correct pin).
- though server side encrypt is not the best option, but in a project of this scale, encryption, along with auth and pin makes is a solid approach.
- End-to-End encryption is followed, where the data security is of atmost priority. 
- Or even in server side encryption in serious production systems:
    - Keys are stored in restricted secret vaults
    - Only the app runtime can access them
    - Developers are audited/logged, and keys are rotated frequently
- So, these are about some security related stuffs that I explored in course of making this project.

    => no need for update routes.
    *Most users don’t update passwords or card details, passwords and in here, the secret phrases, it's better delete and readadd with fresh info, atleast what I think.
     |**remaining routes:
     |   ii. delete
     |       - cards✅
     |       - password✅
     |       - seed phrases.✅
     |
     |* Routes to get the infos from the db
     |  i. /preview - for partial details, in the list of added items
     |      - /cards✅
     |      - /passwords✅
     |      - /secret-phrases✅
     |  ii. /details - for detailed info for the added item, only to be shown once pin is validated
     |      - /card/:id  
     |      - /password/:id
     |      - /secret-phrase/:id

        # testing routes ✅

// frontend
        i. react hook form form validation for : 
            - card✅
            - password✅
            - phrase✅
        ii. displaying partial details in the details section
        iii. when clicked, displaying popup for entering pin
        iv. once pin is validated, showing full card details.
        v. adding copy,delete,update options.

    # Finally 
        -Reset pin functionality, 
        - email setup >> nodemailer >> random hash is generated >> stored in db >> sent to the email
        - route to send email
            - 1st session is validated >> custom reset-token validated
            - after all the validation >> the pin is finally reset. 