const fs = require('fs');
const axios = require('axios');

const apiEndpoint = 'https://public-api.wordpress.com/rest/v1.1/sites/seanwp423897997.wordpress.com';

async function getPosts() {
  const res = await axios.get(`${apiEndpoint}/posts`);

  return res.data.posts;
}

async function createTemplates(posts) {
  let templates = ``;
  posts.forEach(post => {
    const template = `
      <template class="post-template" path="/post/${post.slug}" id="${post.slug}" x-if="currentPage === '/post/${post.slug}'">
        <div class="container">
          <h1>${post.title}</h1>
          ${post.content}
        </div>
      </template>
    `;

    templates += template;
  });

  return templates;
}

async function main() {
  console.log('Fetching posts');
  const posts = await getPosts();
  console.log('Finished fetching posts');
  console.log('Generating templates');
  const newTemplates = await createTemplates(posts);
  console.log('Finished generating templates');
  console.log('Reading index.html');
  const htmlString = fs.readFileSync('index-template.html', 'utf8');
  console.log('Finished reading index.html');
  const splitHTML = htmlString.split('<!-- #posts -->');
  const newPage = splitHTML[0] + '<!-- #posts -->' + newTemplates + '<!-- #posts -->' + splitHTML[2];
  const pageData = new Uint8Array(Buffer.from(newPage));
  console.log('Writing new index.html');
  fs.writeFileSync('index.html', pageData, 'utf8');
  console.log('Finished writing new index.html');
  console.log('New deploy finished!');
  process.exit(0);
}

main();