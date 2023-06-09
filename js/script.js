'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagsLink: Handlebars.compile(document.querySelector('#template-tags-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
};

const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.list.tags',
  cloudClassCount: '5',
  cloudClassPrefix: 'tag-size-',
  authorsListSelector: '.list.authors'
};


function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  //console.log('Link was clicked!');
  //console.log(event);

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  //console.log('clickedElement:', clickedElement);

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  //console.log(articleSelector);

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  //console.log(targetArticle);

  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');

}

// Generating title list

function generateTitleLinks(customSelector = '') {

  /* [DONE] remove contents of titleList */
  const titleList = document.querySelector(opts.titleListSelector);
  //console.log('list found', titleList);
  titleList.innerHTML = '';

  /* [DONE] for each article */
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);
  //console.log('articles found', articles);

  let html = '';

  for (let article of articles) {

    /* [DONE] get the article id */
    const articleId = article.getAttribute('id');
    //console.log('found id', articleId);

    /* [DONE] find the title element */
    /* [DONE] get the title from the title element */
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
    //console.log('found title', articleTitle);

    /* [DONE] create HTML of the link */
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    //console.log('linkHTML', linkHTML);

    /* [DONE] insert link into titleList */
    //titleList.innerHTML = titleList.innerHTML + linkHTML;
    //titleList.insertAdjacentHTML('beforeend', linkHTML);
    html = html + linkHTML;

    //console.log(html);

  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  //console.log('nazwa', links);
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 999999
  };

  for (let tag in tags) {
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }
    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
    //console.log(tag + ' is used ' + tags[tag] + ' times');
  }

  return params;

}

function calculateTagClass(count, params) {

  const normalizedCount = count - params.min;
  //console.log('normalizedCount:', normalizedCount);
  const normalizedMax = params.max - params.min;
  //console.log('normalizedMax:', normalizedMax);
  const percentage = normalizedCount / normalizedMax;
  //console.log('precentage:',percentage);
  const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) + 1);
  //console.log('classNumber:', classNumber);
  return opts.cloudClassPrefix + classNumber;

}

// Generating tags

function generateTags() {

  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* [DONE] find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  //console.log('articles found', articles);

  /* [DONE] START LOOP: for every article: */
  for (let article of articles) {

    /* [DONE] find tags wrapper */
    const tagsWrapper = article.querySelector(opts.articleTagsSelector);
    //console.log('list found:', tagsWrapper);

    /* [DONE] make html variable with empty string */
    let html = '';

    /* [DONE] get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    //console.log('get tags:', articleTags);

    /* [DONE] split tags into array */
    const articleTagsArray = articleTags.split(' ');
    //console.log('tags table:', articleTagsArray);

    /* [DONE] START LOOP: for each tag */
    for (let tag of articleTagsArray) {

      /* [DONE] generate HTML of the link */
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      const linkHTMLData = {id: tag, title: tag};
      const linkHTML = templates.tagsLink(linkHTMLData);
      //console.log('new tags:', linkHTML);

      /* [DONE] add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {

        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      //console.log('allTags', allTags);

      /* [DONE] END LOOP: for each tag */
    }

    /* [DONE] insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    //console.log(tagsWrapper);

    /* [DONE] END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.tagsListSelector);
  //console.log('tagList', tagList);

  /* [NEW] add html from allTags to tagList */
  //tagList.innerHTML = allTags.join(' ');
  //console.log('allTags', allTags);
  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  //console.log('tagsParams', tagsParams);
  //let allTagsHTML = '';
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {

    /* [NEW] generate code of a link and add it to allTagsHTML */
    //allTagsHTML += tag + ' (' + allTags[tag] + ') ';
    const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a></li>';
    //console.log('tagLinkHTML', tagLinkHTML);
    //allTagsHTML += tagLinkHTML; //'<li><a href="#tag-' + tag + '"class="' + tagLinkHTML + '">' + tag + ' (' + allTags[tag] + ')</a></li>';
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });

    /* [NEW] END LOOP: for each tag in allTags: */
  }

  /* [NEW] add html from allTagsHTML to tagList */
  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  //console.log('allTagsHTML', allTagsHTML);
  //console.log('allTagsData', allTagsData);

}


generateTags();

function tagClickHandler(event) {

  /* [DONE] prevent default action for this event */
  event.preventDefault();

  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* [DONE]  make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  //console.log('tag', tag);

  /* [DONE] find all tag links with class active */
  const tagActiveLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* [DONE] START LOOP: for each active tag link */
  for (let tagActiveLink of tagActiveLinks) {

    /* [DONE] remove class active */
    tagActiveLink.classList.remove('active');

    /* [DONE] END LOOP: for each active tag link */
  }
  /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* [DONE] START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {

    /* [DONE] add class active */
    tagLink.classList.add('active');

    /* [DONE] END LOOP: for each found tag link */
  }

  /* [DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');

}

function addClickListenersToTags() {

  /* [DONE] find all links to tags */
  const allTagsLinks = document.querySelectorAll('a[href^="#tag-"]');

  /* [DONE] START LOOP: for each link */
  for (let allTagsLink of allTagsLinks) {

    /* [DONE] dd tagClickHandler as event listener for that link */
    allTagsLink.addEventListener('click', tagClickHandler);

    /* [DONE] END LOOP: for each link */
  }

}

addClickListenersToTags();

// Generating author

function generateAuthors() {

  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};

  /* [DONE] find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  //console.log('articles found', articles);

  /* [DONE] START LOOP: for every article: */
  for (let article of articles) {

    /* [DONE] find authors wrapper */
    const authorWrapper = article.querySelector(opts.articleAuthorSelector);
    //console.log('list found:', authorWrapper);

    /* [DONE] make html variable with empty string */
    let html = '';

    /* [DONE] get author from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');
    //console.log('get author', articleAuthor);

    /* [DONE] generate HTML of the link */
    //const linkHTML = '<li><a href="#author-' + articleAuthor + '"><span>by ' + articleAuthor + '</span></a></li>';
    const linkHTMLData = {id: articleAuthor, title: articleAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);
    //console.log('new author:', linkHTML);

    /* [DONE] add generated code to html variable */
    html = html + linkHTML;
    //console.log(html);

    /* [NEW] check if this link is NOT already in allAuthors */
    if (!allAuthors.hasOwnProperty(articleAuthor)) {

      /* [NEW] add tag to allTags object */
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
    //console.log('allAuthors', allAuthors);

    /* [DONE] insert HTML of all the links into the author wrapper */
    authorWrapper.innerHTML = html;
    //console.log(authorWrapper);

    /* [DONE] END LOOP: for every article: */
  }

  /* [NEW] find list of authors in right column */
  const authorList = document.querySelector(opts.authorsListSelector);
  //console.log('authorList', authorList);

  /* [NEW] create variable for all links HTML code */
  //let allAuthorsHTML = '';
  const allAuthorsData = {authors: []};

  /* [NEW] START LOOP: for each author in allAuthors: */
  for (let author in allAuthors) {
    /* [NEW] generate code of a link and add it to allAuthorsHTML */
    //allAuthorsHTML += author + ' (' + allAuthors[author] + ') ';

    //const authorLinkHTML = '<li><a href="#author-' + author + '"><span>' + author + '</span></a></li>';
    //console.log('authorLinkHTML', authorLinkHTML);
    //allAuthorsHTML += authorLinkHTML;
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
    });

    /* [NEW] END LOOP: for each author in allAuthors: */
  }

  /* [NEW] add html from allTag\\\AuthorsHTML to authorList */
  //authorList.innerHTML = allAuthorsHTML;
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
  //console.log('allAuthorsData', allAuthorsData);

}

generateAuthors();

function authorClickHandler(event) {

  /* [DONE] prevent default action for this event */
  event.preventDefault();

  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* [DONE] make a new constant "author" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');
  //console.log(author);

  /* [DONE] find all author links with class active */
  const authorActiveLinks = document.querySelectorAll('a.active[href^="#author-"]');

  /* [DONE] START LOOP: for each active author link */
  for (let authorActiveLink of authorActiveLinks) {

    /* [DONE] remove class active */
    authorActiveLink.classList.remove('active');

    /* [DONE] END LOOP: for each active author link */
  }

  /* [DONE] find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* [DONE] START LOOP: for each found author link */
  for (let authorLink of authorLinks) {

    /* [DONE] add class active */
    authorLink.classList.add('active');

    /* [DONE] END LOOP: for each found author link */
  }

  /* [DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');

}

function addClickListenersToAuthors() {

  /* [DONE] find all links to autor */
  const allAuthorLinks = document.querySelectorAll('a[href^="#author-"]');

  /* [DONE] START LOOP: for each link */
  for (let allAuthorLink of allAuthorLinks) {

    /* [DONE] add authorClickHandler as event listener for that link */
    allAuthorLink.addEventListener('click', authorClickHandler);

    /* [DONE] END LOOP: for each link */
  }

}

addClickListenersToAuthors();
