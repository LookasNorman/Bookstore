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

    /**
     * render book list for edit
     * @param book
     * @returns {string}
     */
    function renderEditList(book) {
        return `<option value="${book.id}">${book.title}</option>`;
    }

    /**
     * get and show book list
     */
    $.getJSON(URL)
        .done(function (result) {
            const bookListHTML = result.success.map(renderBook).join("");
            $('#booksList').html(bookListHTML);
            const bookEditList = result.success.map(renderEditList).join("");
            $('#bookEditSelect').append(bookEditList);
        })
        .fail(showError);

    /**
     * render edit form for book
     * @param book
     */
    function renderEditForm(book) {
        $('#id').val(book.id);
        $('#bookEdit #title').val(book.title);
        $('#bookEdit #description').val(book.description);
    }

    /**
     * get book for edit
     */
    $('#bookEditSelect').on('click', 'option', function () {
        const editId = this.value;
        $.ajax({
            url: URL + "/" + editId,
            type: "GET"
        })
            .done(function (result) {
                $('#bookEdit').css("display", "block");
                result.success.map(renderEditForm);
                $('#bookEdit button').on('click', function () {

                })
            })
            .fail(showError);
    })



    /**
     * remove book
     */
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

    /**
     * show one book with description
     */
    $('#booksList').on('click', '.btn-book-show-description', function () {
//  (display: none / display: inline)
//         if ($(this).parent().siblings().css("display") === 'none') {
//             $(this).parent().siblings().css("display", "inline");
//         } else {
//             $(this).parent().siblings().css("display", "none");
//         }
//book list - one book with description
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


    /**
     * add new book
     */
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