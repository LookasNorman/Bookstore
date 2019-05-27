$(function () {
    const URL_author = 'http://localhost:8000/author';

    function showError(xhr, status, error) {
        showModal("Error");
    }

    /**
     * show author list from DB
     */
    function authorList() {
        $.getJSON(URL_author)
            .done(function (result) {
                const authorListHTML = result.success.map(renderAuthor).join("");
                $('#authorsList').html(authorListHTML);

                const authorEditList = result.success.map(renderEditList).join("");
                $('#authorEditSelect').html("<option value=\"\"> -- Select Author for edit --</option>");
                $('#authorEditSelect').append(authorEditList);
            })
            .fail(showError)
    }

    /**
     * Render HTML list of author
     * @param author
     * @returns {string}
     */
    function renderAuthor(author) {
        // return `<li class="list-group-item">
        //     <div class="panel panel-default">
        //         <div class="panel-heading"><span class="authorTitle">${author.name} ${author.surname}</span>
        //             <button data-id="${author.id}" class="btn btn-danger pull-right btn-xs btn-author-remove"><i
        //                 class="fa fa-trash"></i></button>
        //         </div>
        //     </div>
        // </li>`;

        return `<li class="list-group-item">
        <div class="panel panel-default">
            <div class="panel-heading"><span class="authorTitle">${author.name} ${author.surname}</span>
                <button data-id="${author.id}" class="btn btn-danger pull-right btn-xs btn-author-remove"><i
                            class="fa fa-trash"></i></button>
                <button data-id="${author.id}" class="btn btn-primary pull-right btn-xs btn-author-books"><i
                            class="fa fa-book"></i></button>
            </div>
            <ul class="authorBooksList"></ul>
        </div>
    </li>`;
    }

    /**
     * Render author edit list
     * @param author
     * @returns {string}
     */
    function renderEditList(author) {
        return `<option value="${author.id}">${author.name} ${author.surname}</option>`;
    }


    function renderEditForm(author) {
        $('#id').val(author.id);
        $('#authorEdit #name').val(author.name);
        $('#authorEdit #surname').val(author.surname);
    }


    /**
     *
     */
    authorList();

    /**
     * add new author
     */
    $('#authorAdd').on('submit', function (event) {
        event.preventDefault();
        let author = {
            name: this.elements.name.value,
            surname: this.elements.surname.value
        }
        $.post({
            url: URL_author,
            data: author
        })
            .done(function (res) {
                book = res.success[0];
                authorList();
            })
            .fail(showError);
    })

    /**
     * remove author from list and DB
     */
    $('#authorsList').on('click', '.btn-author-remove', function () {
        const button = this;
        $.ajax({
            url: URL_author + "/" + this.dataset.id,
            type: "DELETE"
        })
            .done(function () {
                authorList();
            })
            .fail(showError);
    })


    $('#authorEditSelect').on('click', 'option', function () {
        const editId = this.value;
        $.ajax({
            url: URL_author + "/" + editId,
            type: "GET"
        })
            .done(function (result) {
                $('#authorEdit').css("display", "block");
                result.success.map(renderEditForm);
                $('#authorEdit').on('submit', function (event) {
                    event.preventDefault();
                    let author = {
                        id: this.elements.id.value,
                        name: this.elements.name.value,
                        surname: this.elements.surname.value
                    };
                    $.ajax({
                        url: URL_author + "/" + this.elements.id.value,
                        type: "PATCH",
                        data: author
                    });
                    //hide edit form
                    $('#authorEdit').css("display", "none");
                    authorList();
                });
            })
            .fail(showError);
    });
})
