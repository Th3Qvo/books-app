/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      books: '#template-book',
    },
    containerOf: {
      books: '.books-panel > .books-list',
    },
    bookList: {
      singleElement: '.book',
      bookImage: '.book__image',
    },
    filtersForm: {
      filtersWrapper: '.filters',
    },
  };

  const templates = {
    books: Handlebars.compile(document.querySelector(select.templateOf.books).innerHTML),
  };

  const classNames = {
    favoriteBook: 'favorite',
  };

  const render = function(){
    for(let bookID in dataSource.books){
      const book = dataSource.books[bookID];

      const generatedHTML = templates.books(book);

      const element = utils.createDOMFromHTML(generatedHTML);

      const booksContainer = document.querySelector(select.containerOf.books);

      booksContainer.appendChild(element);
    }
  };

  let favoriteBooks = [];
  let filters = [];

	const filterBooks = function(){

	};

  const initActions = function(){
    const booksContainer = document.querySelector(select.containerOf.books);
    const filtersContainer = document.querySelector(select.filtersForm.filtersWrapper);

    booksContainer.addEventListener('click', function(event){
      event.preventDefault();
    });

    booksContainer.addEventListener('dblclick', function(event){
      event.preventDefault();

      if(event.target.offsetParent.classList.contains('book__image')){
        const bookID = event.target.offsetParent.getAttribute('data-id');

        if(!favoriteBooks.includes(bookID)){
          event.target.offsetParent.classList.add(classNames.favoriteBook);
          favoriteBooks.push(bookID);
        } else {
          event.target.offsetParent.classList.remove(classNames.favoriteBook);
          favoriteBooks.splice(favoriteBooks.indexOf(bookID), 1);
        }
      }
    });

    filtersContainer.addEventListener('click', function(event){
      if(event.target.name === 'filter' && event.target.type === 'checkbox'){
        if(event.target.checked){
          filters.push(event.target.value);
        } else if(!event.target.checked){
          filters.splice(filters.indexOf(event.target.value), 1);
        }
      }
    });
  };



  render();
  initActions();
}