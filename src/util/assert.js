module.exports = function (judge, status, data) {
    if (!judge) {
        this.end({
            status: status,
            data: data,
        });
        this.throw('assert check fail');
    }
}