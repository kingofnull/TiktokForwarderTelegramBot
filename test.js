const {tall}=require('tall');


async function someFunction() {
  try {
    const unshortenedUrl = await tall('http://www.loige.link/codemotion-rome-2017');
    console.log('Tall url', unshortenedUrl);
  } catch (err) {
    console.error('AAAW 👻', err);
  }
}

someFunction();