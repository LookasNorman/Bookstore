const URL = 'http://localhost:8000/author';

function showError(xhr, status, error) {
    showModal("Error");
}

function authorList() {
    $.getJSON(URL)
        .done(function (result) {
            const authorListHTML = result.success.map(renderAuthor).join("");
            $('#authorsList').html(authorListHTML);
            console.log(result);
        })
}

function renderAuthor(author) {
    return `<li class="list-group-item">
                <div class="panel panel-default">
                    <div class="panel-heading"><span class="authorTitle">${author.name} ${author.surname}</span>
                        <button data-id="1" class="btn btn-danger pull-right btn-xs btn-author-remove"><i
                            class="fa fa-trash"></i></button>
                    </div>
                </div>
            </li>`;
}

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
        url: URL,
        data: author
    })
        .done(function (res) {
            book = res.success[0];
            console.log(book);
        })
        .fail(showError);

})