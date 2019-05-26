const URL = 'http://localhost:8000/author';

function showError(xhr, status, error) {
    showModal("Error");
}

/**
 * show author list from DB
 */
function authorList() {
    $.getJSON(URL)
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
    return `<li class="list-group-item">
        <div class="panel panel-default">
            <div class="panel-heading"><span class="authorTitle">${author.name} ${author.surname}</span>
                <button data-id="${author.id}" class="btn btn-danger pull-right btn-xs btn-author-remove"><i
                    class="fa fa-trash"></i></button>
            </div>
        </div>
    </li>`;
}


function renderEditList(author) {
    return `<option value="${author.id}">${author.name} ${author.surname}</option>`;
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
        url: URL,
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
        url: URL + "/" + this.dataset.id,
        type: "DELETE"
    })
        .done(function () {
            authorList();
        })
        .fail(showError);
})


console.log($('#authorEditSelect'));