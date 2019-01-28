get('/api/stories', {})
  .then(stories => {
    console.log(stories);
  })
  .catch(error => {
    console.log('something exploded!');
  });



