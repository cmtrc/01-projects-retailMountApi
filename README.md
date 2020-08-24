To run this project:

1. Clone the project
2. Create an .env file, with a variable named TOKEN. The value of this is the response you get from the curl command:

curl -u {client_id}:{client_secret} -d grant_type=client_credentials https://us.battle.net/oauth/token

  2.1 You need to fill inn the Client ID and Client Secret from the client you have set up on Blizzard for access to their APIs.
  2.2 In postman do the following:

      2.2.1 Import->Raw Text-> post the curl string from 2.1 -> Continue -> confirm with "import"

      2.2.2 Go to the Headers-tab->Authorization -> copy the the string from value which starts with "basic"(basic should not be included in the string

      2.2.3 Create the .env file in the root directory of the project with the following: "TOKEN="<your string from 2.2.2(dont include basic)"
      
3. Run the server from terminal with the following command-> node server.js

4. run localhost/8080 in your browser

5. To retrieve all mounts, go to /mounts
    -if you get an error try to edit the splice range on line 39 in the server.js-file. 

6. To retrieve all mounts that a certain player has, go to /profile/:realm/:username
(:realm is replaced by the actual realm name and :username is replaced by the name of the user you wish to see the list of mounts).

Happy stalking!
