# Week 2 Documentation

To read the necesarry text file as a string in Node, I used code from [this StackOverflow answer](https://stackoverflow.com/a/9168933) that I found by Googling.  
From there I load the text to cheerio using the example code from our assignment starter code  

### Getting the right data
![image](https://user-images.githubusercontent.com/20379698/133002422-f5fd81a7-b9c0-4595-9759-7f1be1960311.png)
The easiest way I've found to get the right selectors for HTML scraping is to let the browser generate the selector path/search string for you. I do this in Chrome by inspecting an element I want the path for, and copying the JSpath to my clipboard. In this image you can see where this command is found and the output of this command, which looks like this:  
`document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(12) > td:nth-child(1)")`

From here I take particular notice of `tr:nth-child(12)`, which implies there are multiple <tr> tags in a row. This is what I assume to be the table rows that represent an Address/Location.    
I also notice in this image that the address information that I want is interspersed with `<br>` tags (a tag for creating a line break, which should almost NEVER be used because it's rarely used in a semantic way). Because I know that the address info lies between `<br>` tags, I write a selector that gathers every `<br>` tag within the <td> (table data) tags from the previous selector, which looks like this: `body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td:nth-child(1) br'`.   
`$(*some-path-string*)` returns a list called a NodeList, a data type similar to, but not the same as an Array. Because I prefer working with Arrays, I use `Array.from($(*some-search-path*))`  
  
So far, I have this output:  
![image](https://user-images.githubusercontent.com/20379698/133002837-cb17587d-c4cd-486d-9873-3101e9a518af.png)  
  
This is a long list of HTML Nodes, each with properties `parent`, `prev`, and `next`. I notice in the image that the first `.next` is of type text. I want to grab text information.  
My way of grabbing all the text nodes looks like this: `.filter(node => node.name && node.name == 'br' && node.next && node.next.type == 'text')`. In this code I filter down the previous list to only include text nodes.  
I want nodes that *follow* `<br>` tags, and have a `type` of `text`. Checking for `node.name` and `node.next` prevent the app from failing, because if a node doesn't have either of those properties, we can filter it out as well.
  
Now my output looks similar to the image above, but only contains `<br>` tags that are followed by text nodes. Keep in mind that these nodes have a `.next` property.  
From here my goal is to grab the text found in these nodes in `.next`. I do this my mapping through my current data, and grabbing `.next.data`. I also use the `.trim()` string method, which takes away unneeded whitespace. The full method now looks like this:  
```
Array.from($('body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td:nth-child(1) br'))
    .filter(node => node.name && node.name == 'br' && node.next && node.next.type == 'text')
    .map(node => node.next.data.trim())
```
And here is the output!
![image](https://user-images.githubusercontent.com/20379698/133003113-c371c6f6-0962-457e-bb8a-1824e1ca80a5.png)

We're incredibly close! Now I need to get rid of the empty strings and extra linebreaks like `\n` and `\t`. I do this by adding `.map(el => el.replace(/\t/g, ''))`, `.map(el => el.replace(/\n/g, ''))`, and `.filter(string => string != '')`. Which remove linebreaks and filter out array indexes with empty strings.  
The output now looks like:
```
[
  '109 West 129th Street,  Basement,',
  '(@ Lenox Avenue) NY 10027',
  '240 West 145th Street,',
  '(Betw 7th & 8th Avenues) NY 10039',
  'Fri.=Alternates between Step & Tradition.',
  '469 West 142nd Street, Basement,',
  '(Betw Convent & Amsterdam Avenues) NY 10031',
  '204 West 134th Street, 1st Floor,',
  '(Betw 7th & 8th Avenues) 10030',
  '2044 Adam Clayton Powell Blvd.,',
  '(@ 122nd Street) NY 10027',
  '469 West 142nd Street, 1st Floor,',
  '(Betw. Amsterdam & Convent Avenues) 10031',
  '521 W 126th St,',
  'Amsterdam & Old Broadway 10027',
  '109 West 129th Street, Basement,',
```

I notice that non-address text like `'Fri.=Alternates between Step & Tradition.',` in my data file are followed by a line with a zipcode (in this case, `'(Betw 7th & 8th Avenues) NY 10039',`), so I decide that I can filter out rows in my array that neither *contain* a zipcode or *come right before* a row with a zipcode.  

How do I figure out if a row (or following row) has a zipcode? I search on Google. RegEx (Regular Expressions) are often used in code to match complicated types of strings, so I Google search something along the lines of "RegEx find 5 digit number".  
The answer [here](https://stackoverflow.com/a/4975676) is very helpful, and I use that RegEx to create a function that returns `true` if a string has a zipcode. It looks like this: `const checkForZipcode = str => (/\b\d{5}\b/g).test(str)`.  
Now I use that function to filter my array based on the criteria I mentioned before, which looks like this: `.filter((el, i, arr) => checkForZipcode(el) || checkForZipcode(arr[i + 1]))` (.filter takes 3 arguments, the element it's currently looping on, the index it's looping on, and the whole array that you've passed in.)  
  
My code now looks like this:
```
Array.from($('body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td:nth-child(1) br'))
    .filter(node => node.name && node.name == 'br' && node.next && node.next.type == 'text')
    .map(node => node.next.data.trim())
    .map(el => el.replace(/\t/g, ''))
    .map(el => el.replace(/\n/g, ''))
    .filter(string => string != '')
    .filter((el, i, arr) => checkForZipcode(el) || checkForZipcode(arr[i + 1]))
```
And logging this output looks like this:
```
[
  '109 West 129th Street,  Basement,',
  '(@ Lenox Avenue) NY 10027',
  '240 West 145th Street,',
  '(Betw 7th & 8th Avenues) NY 10039',
  '469 West 142nd Street, Basement,',
  '(Betw Convent & Amsterdam Avenues) NY 10031',
  '204 West 134th Street, 1st Floor,',
  '(Betw 7th & 8th Avenues) 10030',
  '2044 Adam Clayton Powell Blvd.,',
  '(@ 122nd Street) NY 10027',
  '469 West 142nd Street, 1st Floor,',
  '(Betw. Amsterdam & Convent Avenues) 10031',
  '521 W 126th St,',
  'Amsterdam & Old Broadway 10027',
  '109 West 129th Street, Basement,',
  '(Betw Lenox Avenue & Adam Clayton Powell Blvd) NY 10027',
  '469 West 142nd Street, Basement,',
```
Great! Now my data looks like it can be considered in pairs of two. Street address, and state/zipcode.  

 
