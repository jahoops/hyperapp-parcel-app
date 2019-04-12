$('.hypersearch').each(function () {
    app({
        init: {
            search: '',
            foundList: [],
            variation: $(this).attr('variation')
        },
        view: function (search, foundList, variation) {
            return h("main", null, h("div", null, " Search Nobel laureates (" + variation + "): "), 
                h("input", {
                    type: "text",
                    className: "searchInput",
                    value: search,
                    oninput: UpdateSearch
                }),
                h("br", null), foundList.length ?
                foundList.map(function (item) {
                    return h("div", {className: "userCard"},
                        h("div", {"class": variation}, item.firstname + ' ' + item.surname),
                        h("div", {"class": "userCard__location"}, item.bornCity + ', ' + item.bornCountry)
                    );
                }) :
                h("div", {className: "userCard"}, "  \uD83D\uDC46 enter name or other info ")
            );
        },
        container: this
    })
});