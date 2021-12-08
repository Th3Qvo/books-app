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
    hiddenBook: 'hidden',
  };

  class BooksList {
    constructor(){
      const thisBooksList = this;

      /* APP IGNITE */
      thisBooksList.initData();
      thisBooksList.getElements();
      thisBooksList.render();
      thisBooksList.initActions();
    }

    initData(){
      const thisBooksList = this;

      thisBooksList.data = dataSource.books;
    }

    render(){
      const thisBooksList = this;

      for(let bookID in thisBooksList.data){
        const book = thisBooksList.data[bookID];
  
        /* DETERMINE RATING BAR COLOR DATA */
        book.ratingBgc = thisBooksList.determineRatingBgc(book.rating);
        book.ratingWidth = parseInt(book.rating * 10);
  
        /* GENERATE HTML OUT OF HANDLEBARS TEMPLATE */
        const generatedHTML = templates.books(book);
  
        const element = utils.createDOMFromHTML(generatedHTML);
  
        thisBooksList.dom.booksContainer.appendChild(element);
      }
    }

    getElements(){
      const thisBooksList = this;

      thisBooksList.dom = {};

      thisBooksList.dom.booksContainer = document.querySelector(select.containerOf.books);
      thisBooksList.dom.filtersContainer = document.querySelector(select.filtersForm.filtersWrapper);
    }

    initActions(){
      const thisBooksList = this;

      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];

      thisBooksList.dom.booksContainer.addEventListener('click', function(event){
        event.preventDefault();
      });

      thisBooksList.dom.booksContainer.addEventListener('dblclick', function(event){
        event.preventDefault();

        if(event.target.offsetParent.classList.contains('book__image')){
          const bookID = event.target.offsetParent.getAttribute('data-id');

          if(!thisBooksList.favoriteBooks.includes(bookID)){
            event.target.offsetParent.classList.add(classNames.favoriteBook);
            thisBooksList.favoriteBooks.push(bookID);
          } else {
            event.target.offsetParent.classList.remove(classNames.favoriteBook);
            thisBooksList.favoriteBooks.splice(thisBooksList.favoriteBooks.indexOf(bookID), 1);
          }
        }
      });

      thisBooksList.dom.filtersContainer.addEventListener('click', function(event){
        if(event.target.name === 'filter' && event.target.type === 'checkbox'){

          if(event.target.checked){
            thisBooksList.filters.push(event.target.value);
          } else if(!event.target.checked){
            thisBooksList.filters.splice(thisBooksList.filters.indexOf(event.target.value), 1);
          }

          event.target.addEventListener('change', function(){
            thisBooksList.filterBooks();
          });
        }
      });
    }

    filterBooks(){
      const thisBooksList = this;

      for(let book of thisBooksList.data){
        let shouldBeHidden = false;
  
        for(let filter of thisBooksList.filters){
          if(!book.details[filter] === true){
            shouldBeHidden = true;
            break;
          }
        }
  
        if(shouldBeHidden === true){
          document.querySelector('.book__image[data-id="' + book.id + '"').classList.add(classNames.hiddenBook);
        } else {
          document.querySelector('.book__image[data-id="' + book.id + '"').classList.remove(classNames.hiddenBook);
        }
      }
    }

    determineRatingBgc(rating){
      let ratingBgc;

      if(rating <= 6) ratingBgc = 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%';
      if(rating > 6 && rating <= 8) ratingBgc = 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%';
      if(rating > 8 && rating <= 9) ratingBgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%';
      if(rating > 9) ratingBgc = 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%';

      return ratingBgc;
    }
  }

  const app = new BooksList();
}