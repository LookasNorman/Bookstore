$(function () {

    const URL = 'http://localhost:8000/book';

    function showError(xhr, status, error) {
        showModal("Error");
    }

//render book list
    function renderBook(book) {
        return `<li class="list-group-item">
          <div class="panel panel-default">
            <div class="panel-heading">
               <span class="bookTitle">${book.title}</span>
                  <button data-id="${book.id}"
                     class="btn btn-danger pull-right btn-xs btn-book-remove"><i
                     class="fa fa-trash"></i>
                  </button>
                  <button data-id="${book.id}"
                     class="btn btn-primary pull-right btn-xs btn-book-show-description"><i
                     class="fa fa-info-circle"></i>
                  </button>
            </div>
          <div class="panel-body book-description">${book.description}</div>
          </div> 
          </li>`;
    }

    $.getJSON(URL)
        .done(function (result) {
            const bookListHTML = result.success.map(renderBook).join("");
            $('#booksList').html(bookListHTML);
        })
        .fail(showError);
//remove book
    $('#booksList').on('click', '.btn-book-remove', function () {
        const button = this;
        $.ajax({
            url: URL + "/" + this.dataset.id,
            type: "DELETE"
        })
            .done(function () {
                $(button).closest('.list-group-item').remove();
            })
            .fail(showError);
    });
//show description
    $('#booksList').on('click', '.btn-book-show-description', function () {
//  (display: none / display: inline)
//         if ($(this).parent().siblings().css("display") === 'none') {
//             $(this).parent().siblings().css("display", "inline");
//         } else {
//             $(this).parent().siblings().css("display", "none");
//         }
//book list - one book with description
        console.log(this.dataset.id);
        $.ajax({
            url: URL + "/" + this.dataset.id,
            type: "GET"
        })
            .done(function (result) {
                const bookListHTML = result.success.map(renderBook).join("");
                $('#booksList').html(bookListHTML);
                $('.book-description').css("display", "inline");
            })
            .fail(showError);
    });


//add book
    $('#bookAdd').on('submit', function (event) {
        event.preventDefault();

        let book = {
            title: this.elements.title.value,
            description: this.elements.description.value
        };

        $.post({
            url: URL,
            data: book
        })
            .done(function (res) {
                book = res.success[0];
                $('#booksList').append($(renderBook(book)));
            })
            .fail(showError);
    });

});