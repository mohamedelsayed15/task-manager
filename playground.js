// let grid = [[1, 2, 4], [3, 3, 1]]

// let deleteGreatestValue = (grid) => { 

//     let sortedGrid = grid.map(element => { 
//         element.sort((a, b) =>
//         {
//             return a - b
//         })
//         return element
//     })

//     let biggest = 0
//     let answer = 0
//     let popedElement = 0
//     let maxSize =0
//     sortedGrid.forEach(element => { if (element.length > maxSize) { maxSize = element.length } })
//     console.log(maxSize)
//     for (i = 0; i < maxSize; i++) { 

//     }
//     // sortedGrid.forEach(element => {

//     //     element.forEach(element => {
//     //         popedElement = element.pop()
        
//     //     if (popedElement > biggest) {
//     //         biggest = popedElement
//     //         answer += biggest
//     //     }
//     //     biggest = 0
//     //      })
//     // })
//     return answer;
// }

// console.log(deleteGreatestValue(grid))

const express = require('express');
const app = express();
const FuzzySet = require('fuzzyset.js');

const strings = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
const fuzzy = FuzzySet(strings);

app.get('/search', (req, res) => {
  const query = req.query.q;
  const match = fuzzy.get(query);
  if (match && match[0][0] >= 0.7) {
    res.send(`Found match: "${match[0][1]}"`);
  } else {
    res.send('No match found.');
  }
});

app.listen(3000, () => {
  console.log('Fuzzy search app listening on port 3000!');
});
