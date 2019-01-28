// Returns the first story in the db
function getFirstStory() {
  return get('/api/stories', {}).then(stories => stories[0]);
}

getFirstStory()
  .then(firstStory => {
    return get('/api/comment', {parent: firstStory._id});
  })
  .then(comments => {
    // Print all comments from the first story
    console.log(comments); 
  };

get('/api/thing1', {})
  .then(data1 => {
    return get('/api/thing2', {data: data1});
  })
  .then(data2 => {
    return get('/api/thing3', {data: data2});
  })
  .then(data3 => {
    return get('/api/thing4', {data: data3});
  })
  .then(data4 => {
    return get('/api/thing5', {data: data4});
  })
  .then(data5 => {
    return get('/api/thing6', {data: data5});
  })


// Fire all requests
// May finish in any order
const promises = [
  get('/api/thing1', {}),
  get('/api/thing2', {}),
  get('/api/thing3', {}),
  get('/api/thing4', {}),
  get('/api/thing5', {}),
  get('/api/thing6', {})
];

Promise.all(promises).then(responses => {
  // Callback runs when all requests finish
  console.log(responses)
})


const nums = [1, 2, 5, 7];

const tripled = nums.map(x => x * 3);
console.log(tripled); // [3, 6, 15, 21]

