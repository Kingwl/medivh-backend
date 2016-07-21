module.exports = function* (next) {
    this.assert = function (judge, status, data) {
        if (!judge) {
            this.end({
                status: status,
                data: data,
            });
            this.throw('assert check fail');
        }
    }
    yield next;
}