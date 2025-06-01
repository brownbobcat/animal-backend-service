*** Run: npm install
*** Add .env file with secret key: SECRET_KEY

*** UPDATED SETUP
1. Server: npm start
2. Users: [username = nick] [password = admin@123]
          [username = kojo] [password = admin]

//-------------------------------------------------//

1. Get all Animals: npx tsx src/index.ts animals all
2. Get one animal: npx tsx src/index.ts animals one 1
3. Login: npx tsx src/index.ts login nick admin@123
          npx tsx src/index.ts login kojo admin
4. User: npx tsx src/index.ts user <auth token here>
5. Create Animal: npx tsx src/index.ts animals create <auth token here> '{"name":"African Elephant","sciName":"Loxodonta africana","description":["The African bush elephant is the largest living terrestrial animal.","They are herbivores and can be found in Sub-Saharan Africa."],"images":["https://example.com/elephant1.jpg","https://example.com/elephant2.jpg"],"events":[{"name":"Conservation Status Updated","date":"03/15/2023","url":"https://example.com/elephant-conservation"}]}'
