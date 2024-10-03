## Note:

1. added api call to /api/summarize -> in popup.js
2. route.ts
    - it contains the code that take req (text) 
    - send it to openai api for summarization
    - returns a response back

## Problem

1. Insufficient quota when run using postman 
    - pass some text in the body - getting an error i.e insufficient quota

2. Extension
    - it is showing an error while calling callOpenAiApi function
        - popup.js:38
    
    - it is returning an object 🔥🔥🔥[object ] - when used on plain html page

    - that means that fetch api call is working perfectly fine from popup.js

## Doubt 

1. Is the openai API key a problem
   Or
2. something wrong with the dammn code


## Implementing

- Axios call just to be on the safer side - that the code is working fine & the problem is the openai api key and not the code

