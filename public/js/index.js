function main() {
  get('/api/whoami', {}).then(function(user) {
    console.log(user);
    renderNavbar(user);
    renderStories(user);

    const socket = io();
    socket.on('story', function(story) {
      console.log("story received via socket");
      const storiesDiv = document.getElementById('stories');
      storiesDiv.prepend(storyDOMObject(story, user));
    });
    
    socket.on('comment', function(comment) {
      console.log("comment received via socket");
      const commentDiv = document.getElementById(comment.parent + '-comments');
      commentDiv.appendChild(commentDOMObject(comment));
    });
  });
}

main();
