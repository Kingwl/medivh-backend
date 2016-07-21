module.exports = function* (next) {
    this.end = function(data) {
        this.response.status = data.status || 200;
        this.body = data.data;
    };
    yield next;
}