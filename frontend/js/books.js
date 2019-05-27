$(function () {

    const URL_books = 'http://localhost:8000/book';
    const URL_author = 'http://localhost:8000/author';

    function showError(xhr, status, error) {
        showModal("Error");
    }

    //render book list
    function renderBook(book) {
        return `<li class="list-group-item">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <span class="bookTitle">${book.title} - ${book.author.name} ${book.author.surname}</span>
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
     *
     */
    function bookList() {
        $.getJSON(URL_books)
            .done(function (result) {
                const bookListHTML = result.success.map(renderBook).join("");
                $('#booksList').html(bookListHTML);
                const bookEditList = result.success.map(renderEditList).join("");
                $('#bookEditSelect').html("<option value=\"\"> -- Select Book for edit --</option>");
                $('#bookEditSelect').append(bookEditList);
            })
            .fail(showError);
    }

    /**
     * render edit form for book
     * @param book
     */
    function renderEditForm(book) {
        $('#id').val(book.id);
        $('#bookEdit #title').val(book.title);
        $('#bookEdit #description').val(book.description);
        const authorId = book.author_id;
        $('#author_id_edit option').each(function (e) {
            if (e == authorId) {
                $(this).attr("selected", true);
            } else {
                $(this).attr("selected", false);
            }
        });
    }

    /**
     * render author list for book form (add / edit)
     * @param author
     * @returns {string}
     */
    function renderAuthorListToBook(author) {
        return `<option value="${author.id}">${author.name} ${author.surname}</option>`;
    }

    bookList();

    $.getJSON(URL_author)
        .done(function (result) {
            const authorList = result.success.map(renderAuthorListToBook).join("");
            $('#author_id').html("<option value=\"\"> -- Select Author --</option>");
            $('#author_id').append(authorList);

            $('#author_id_edit').html("<option value=\"\"> -- Select Author --</option>");
            $('#author_id_edit').append(authorList);


        })
        .fail(showError);

    /**
     * get book for edit
     */
    $('#bookEditSelect').on('click', 'option', function () {
        const editId = this.value;
        $.ajax({
            url: URL_books + "/" + editId,
            type: "GET"
        })
            .done(function (result) {
                $('#bookEdit').css("display", "block");
                result.success.map(renderEditForm);
                $('#bookEdit').on('submit', function (event) {
                    event.preventDefault();
                    let book = {
                        id: this.elements.id.value,
                        title: this.elements.title.value,
                        description: this.elements.description.value,
                        author_id: this.elements.author_id.value
                    };
                    $.ajax({
                        url: URL_books + "/" + this.elements.id.value,
                        type: "PATCH",
                        data: book
                    });
                    //hide edit form
                    $('#bookEdit').css("display", "none");
                    bookList();
                });
            })
            .fail(showError);
    })


    /**
     * remove book
     */
    $('#booksList').on('click', '.btn-book-remove', function () {
        const button = this;
        $.ajax({
            url: URL_books + "/" + this.dataset.id,
            type: "DELETE"
        })
            .done(function () {
                // $(button).closest('.list-group-item').remove();
                bookList();
            })
            .fail(showError);
    });

    /**
     * show one book with description
     */
    $('#booksList').on('click', '.btn-book-show-description', function () {
        $.ajax({
            url: URL_books + "/" + this.dataset.id,
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
            description: this.elements.description.value,
            author_id: this.elements.author_id.value
        };

        $.post({
            url: URL_books,
            data: book
        })
            .done(function (res) {
                book = res.success[0];
                bookList();
            })
            .fail(showError);
    });


});