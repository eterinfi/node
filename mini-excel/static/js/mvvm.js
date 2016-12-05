var ID = 'S-001';
var COLUMNS = 10;

function createHeader() {
    var hdr = [{
        row: 0,
        col: 0,
        text: ''
    }];
    for (var i=1; i<=COLUMNS; i++) {
        hdr.push({
            row: 0,
            col: i,
            text: String.fromCharCode(64 + i)
        });
    }
    return hdr;
}

function createRow(rIndex) {
    var row = [{
        row: rIndex,
        col: 0,
        contentEditable: false,
        text: '' + rIndex,
        align: 'left'
    }];
    for (var i=1; i<=COLUMNS; i++) {
        row.push({
            row: rIndex,
            col: i,
            contentEditable: true,
            text: '',
            align: 'left'
        });
    }
    return row;
}

function createRows() {
    var rows = [];
    for (var i=1; i<=100; i++) {
        rows.push(createRow(i));
    }
    return rows;
}

$(function () {
    var vm = new Vue({
        el: '#sheet',
        data: {
            title: 'New Sheet',
            header: createHeader(),
            rows: createRows(),
            selectedRowIndex: 0,
            selectedColIndex: 0
        },
        methods: {
            open: function () {
                var that = this;
                that.$resource('/api/sheets/' + ID).get().then(function (resp) {
                    resp.json().then(function (result) {
                        that.title = result.title;
                        that.rows = result.rows;
                    });
                }, function (resp) {
                    alert('Failed to load.');
                });
            },
            save: function () {
                this.$resource('/api/sheets/' + ID).update({
                    title: this.title,
                    rows: this.rows
                }).then(function (resp) {
                    console.log('saved ok.');
                }, function (resp) {
                    alert('failed to save.');
                });
            },
            focus: function (cell) {
                this.selectedRowIndex = cell.row;
                this.selectedColIndex = cell.col;
            },
            change: function (e) {
                var
                    rowIndex = this.selectedRowIndex,
                    colIndex = this.selectedColIndex;
                if (rowIndex > 0 && colIndex > 0) {
                    var text = e.target.innerText;
                    this.rows[rowIndex - 1][colIndex].text = text;
                }
            }
        }
    });
    window.vm = vm;

    function setAlign(align) {
        var
            rowIndex = vm.selectedRowIndex,
            colIndex = vm.selectedColIndex;
        if (rowIndex > 0 && colIndex > 0) {
            var row = vm.rows[rowIndex - 1];
            var cell = row[colIndex];
            cell.align = align;
        }
    }

    $('#cmd-open').click(function () {
        vm.open();
    });

    $('#cmd-save').click(function () {
        vm.save();
    });

    $('#cmd-left').click(function () {
        setAlign('left');
    });

    $('#cmd-center').click(function () {
        setAlign('center');
    });

    $('#cmd-right').click(function () {
        setAlign('right');
    });

    $('#cmd-download').click(function () {
        var
            fileName = vm.title + '.xls',
            a = document.createElement('a');
        a.setAttribute('href', 'data:text/xml, ' + encodeURIComponent(makeXls(vm.rows)));
        a.setAttribute('download', fileName);
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    $('#toolbar button').focus(function () {
        $(this).blur();
    });
});