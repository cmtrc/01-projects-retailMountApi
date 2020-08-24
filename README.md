To run this project:

1. Clone the project
2. Create an .env file where you enter your client id and client secret in the following format: 

    CLIENTID="<client id goes here>"
  
    CLIENT_SECRET="<client secret goes here>"
      
3. Run the server from terminal with the following command-> node server.js

4. run localhost:8080 in your browser

5. To retrieve all mounts, go to /mounts

    -if you get an error try to edit the splice range on line 39 in the server.js-file. 

6. To retrieve all mounts that a certain player has, go to /profile/:realm/:username
(:realm is replaced by the actual realm name and :username is replaced by the name of the user you wish to see the list of mounts).

Happy stalking!
